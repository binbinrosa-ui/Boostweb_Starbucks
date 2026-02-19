/**
 * Starbucks Homepage - Main Server Entry Point
 * 
 * 메인 서버 진입점 - Cloudtype, Heroku 등 배포 서비스에서 사용
 * 
 * 사용법:
 * - node index.js (이 파일 실행)
 * - npm start (이 파일 실행)
 * - npm run dev (개발 모드)
 */

console.log('🚀 [Starbucks] Starbucks Homepage 서버를 시작합니다...');
console.log('📁 [Starbucks] 메인 서버 로직: server/app.js');
console.log('🔄 [Starbucks] 스마트 MongoDB 연결 활성화');

// 환경변수 로드 (로컬 개발용 .env 파일, Cloudtype에서는 Environment Variables 사용)
try {
    require('dotenv').config({ path: './.env' });
    console.log('📄 [Starbucks] .env 파일 로드 완료');
} catch (error) {
    console.log('📄 [Starbucks] .env 파일 없음 (배포 환경에서는 정상)');
}

// 필수 환경변수 확인
console.log('🔍 [Starbucks] 환경변수 확인:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   PORT:', process.env.PORT || '3000 (기본값)');
console.log('   MONGO_ATLAS_URI:', process.env.MONGO_ATLAS_URI ? '✅ 설정됨' : '❌ 설정 안됨');

// Express 앱과 데이터베이스 연결 함수 가져오기
const app = require('./server/app.js');
const { connect, getConnectionInfo } = require('./server/database');

// 포트 설정 - Cloudtype에서 자동 할당
const PORT = process.env.PORT || 3000;

// 서버 시작 함수
async function startServer() {
    try {
        console.log('🔄 [Starbucks] 데이터베이스 연결 중...');
        
        // 1. MongoDB 연결 시도
        await connect();
        const info = getConnectionInfo();
        console.log('✅ [Starbucks] MongoDB 연결 성공!');
        console.log('📊 [Starbucks] 데이터베이스 연결 정보:', {
            database: info.database,
            isConnected: info.isConnected,
            connectionType: info.connectionString.includes('mongodb+srv') ? 'Atlas (클라우드)' : '로컬'
        });
        
        // 2. 서버 시작 (Cloudtype용 0.0.0.0 바인딩)
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 [Starbucks] 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`📝 [Starbucks] 환경: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 [Starbucks] 호스트: 0.0.0.0:${PORT}`);
            
            // 연결 정보 표시
            setTimeout(() => {
                console.log('✅ [Starbucks] 시스템 준비 완료!');
                console.log(`📊 [Starbucks] DB 상태: ${info.isConnected ? '연결됨' : '연결 안됨'}`);
                
                console.log('\n📖 [Starbucks] 사용 가능한 엔드포인트:');
                console.log('   GET  /                   - 메인 홈페이지');
                console.log('   GET  /api/health         - 서버 상태 확인');
                console.log('   GET  /api/db-status      - DB 상태 확인');
                console.log('   POST /api/auth/register  - 회원가입');
                console.log('   POST /api/auth/login     - 로그인');
            }, 1000);
        });

        // 서버 오류 처리
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ [Starbucks] 포트 ${PORT}가 이미 사용 중입니다.`);
            } else {
                console.error('❌ [Starbucks] 서버 오류:', error.message);
            }
            process.exit(1);
        });
        
    } catch (error) {
        console.error('❌ [Starbucks] 서버 시작 실패:', error.message);
        console.error('❌ [Starbucks] 오류 스택:', error.stack);
        
        // 일반적인 오류 해결책 제시
        if (error.message.includes('authentication failed')) {
            console.log('\n💡 [해결책] MongoDB Atlas 연결 확인:');
            console.log('1. Cloudtype Environment Variables에서 MONGO_ATLAS_URI 확인');
            console.log('2. MongoDB Atlas IP 화이트리스트에 0.0.0.0/0 추가');
            console.log('3. 사용자명/비밀번호 확인');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n💡 [해결책] 네트워크 연결 확인:');
            console.log('1. 인터넷 연결 상태 확인');
            console.log('2. MongoDB Atlas 클러스터 상태 확인');
        }
        
        // 개발 환경에서는 MongoDB 없이도 서버 시작 허용
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ [Starbucks] 개발 환경 - DB 연결 없이 서버 시작');
            const server = app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 [Starbucks] 서버가 포트 ${PORT}에서 실행 중 (DB 연결 없음)`);
            });
        } else {
            process.exit(1);
        }
    }
}

// 서버 시작
startServer().catch((error) => {
    console.error('❌ [Starbucks] 예상치 못한 오류:', error);
    process.exit(1);
});


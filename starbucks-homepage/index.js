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

// 환경변수 로드 (프로젝트 루트의 .env 파일)
require('dotenv').config({ path: './.env' });

// Express 앱과 데이터베이스 연결 함수 가져오기
const app = require('./server/app.js');
const { connect, getConnectionInfo } = require('./server/database');

// 포트 설정
const PORT = process.env.PORT || 3000;

// 서버 시작 함수
async function startServer() {
    try {
        console.log('🔄 [Starbucks] 데이터베이스 연결 중...');
        
        // 1. MongoDB 연결
        await connect();
        const info = getConnectionInfo();
        console.log('📊 [Starbucks] 데이터베이스 연결 정보:', {
            database: info.database,
            isConnected: info.isConnected,
            connectionType: info.connectionString.includes('mongodb+srv') ? 'Atlas (클라우드)' : '로컬'
        });
        
        // 2. 서버 시작
        app.listen(PORT, () => {
            console.log(`🚀 [Starbucks] 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`🌍 [Starbucks] 웹사이트: http://localhost:${PORT}`);
            console.log(`🔗 [Starbucks] API: http://localhost:${PORT}/api`);
            console.log(`📝 [Starbucks] 환경: ${process.env.NODE_ENV || 'development'}`);
            
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
        
    } catch (error) {
        console.error('❌ [Starbucks] 서버 시작 실패:', error.message);
        
        // Atlas 연결 실패 시 로컬로 폴백 시도 안내
        if (error.message.includes('authentication failed')) {
            console.log('\n💡 [해결책] MongoDB Atlas 연결 확인:');
            console.log('1. 사용자명/비밀번호 확인');
            console.log('2. IP 화이트리스트 설정');
            console.log('3. 환경변수 MONGO_ATLAS_URI 확인');
        }
        
        process.exit(1);
    }
}

// 서버 시작
startServer().catch((error) => {
    console.error('❌ [Starbucks] 예상치 못한 오류:', error);
    process.exit(1);
});


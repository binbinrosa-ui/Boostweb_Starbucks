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
if (process.env.MONGO_ATLAS_URI) {
    const maskedUri = process.env.MONGO_ATLAS_URI.replace(/\/\/.*@/, '//***:***@');
    console.log('   MONGO_ATLAS_URI 값:', maskedUri);
}
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ 설정됨' : '❌ 설정 안됨');
console.log('   SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ 설정됨' : '❌ 설정 안됨');

// Express 앱과 데이터베이스 연결 함수 가져오기
const app = require('./server/app.js');
const { connect, getConnectionInfo } = require('./server/database');

// 포트 설정 - Cloudtype에서 자동 할당
const PORT = process.env.PORT || 3000;

// 서버 시작 함수 (DB 연결과 분리)
function startServer() {
    // 1. 서버를 먼저 시작 (Cloudtype용 0.0.0.0 바인딩)
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('\n🎉 ================================');
        console.log('🚀 [Starbucks] 서버 시작 완료!');
        console.log('🌐 [Starbucks] 주소: 0.0.0.0:' + PORT);
        console.log('📝 [Starbucks] 환경:', process.env.NODE_ENV || 'development');
        console.log('⏰ [Starbucks] 시작 시간:', new Date().toISOString());
        console.log('================================ 🎉\n');
        
        console.log('📖 [Starbucks] 테스트 가능한 엔드포인트:');
        console.log('   🏠 GET  /ping            - 기본 연결 테스트');
        console.log('   🏠 GET  /                - 메인 홈페이지');
        console.log('   📡 GET  /api            - API 정보');
        console.log('   ❤️  GET  /api/health     - 서버 상태 확인');
        console.log('   💾 GET  /api/db-status  - DB 상태 확인');
        console.log('   👤 POST /api/auth/register - 회원가입');
        console.log('   🔐 POST /api/auth/login - 로그인');
        
        // 3초 후 MongoDB 연결 시도 (서버 안정화 대기)
        console.log('\n🔄 [Starbucks] 3초 후 데이터베이스 연결을 시작합니다...');
        setTimeout(connectToDatabase, 3000);
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

    return server;
}

// MongoDB 연결 함수 (서버와 독립적으로 실행)
async function connectToDatabase() {
    // 환경변수 확인
    if (!process.env.MONGO_ATLAS_URI) {
        console.log('⚠️ [Starbucks] MONGO_ATLAS_URI 환경변수가 설정되지 않았습니다.');
        console.log('📖 [Starbucks] 데이터베이스 기능 없이 서버 실행 중...');
        return;
    }

    try {
        console.log('🔄 [Starbucks] 데이터베이스 연결 시도 중...');
        
        // 연결 타임아웃을 짧게 설정 (Cloudtype 환경 고려)
        await connect();
        const info = getConnectionInfo();
        console.log('✅ [Starbucks] MongoDB 연결 성공!');
        console.log('📊 [Starbucks] 데이터베이스 연결 정보:', {
            database: info.database,
            isConnected: info.isConnected,
            connectionType: info.connectionString.includes('mongodb+srv') ? 'Atlas (클라우드)' : '로컬'
        });
        
    } catch (error) {
        console.error('⚠️ [Starbucks] MongoDB 연결 실패 (서버는 계속 실행)');
        console.error('📝 [Starbucks] 오류 상세:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
        
        // 상세한 오류 분석 및 해결책 제시
        if (error.message.includes('authentication failed') || error.message.includes('Authentication failed')) {
            console.log('\n💡 [해결책] MongoDB Atlas 인증 실패:');
            console.log('1. Cloudtype Environment Variables에서 MONGO_ATLAS_URI 값 확인');
            console.log('2. MongoDB Atlas 사용자명/비밀번호 재확인');
            console.log('3. 특수문자가 URL 인코딩되었는지 확인 (예: ! → %21)');
        } else if (error.message.includes('ENOTFOUND') || error.code === 'ENOTFOUND') {
            console.log('\n💡 [해결책] 네트워크 연결 실패:');
            console.log('1. MongoDB Atlas 클러스터가 활성화되어 있는지 확인');
            console.log('2. 클러스터 주소가 올바른지 확인');
        } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('\n💡 [해결책] IP 화이트리스트 문제:');
            console.log('1. MongoDB Atlas Network Access에서 0.0.0.0/0 추가');
            console.log('2. "Allow access from anywhere" 옵션 활성화');
        } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            console.log('\n💡 [해결책] 연결 타임아웃:');
            console.log('1. MongoDB Atlas 클러스터 상태 확인');
            console.log('2. 네트워크 연결 상태 확인');
        }
        
        // 30초 후 재연결 시도 (너무 자주 시도하지 않도록)
        console.log('🔄 [Starbucks] 30초 후 MongoDB 재연결 시도...');
        setTimeout(connectToDatabase, 30000);
    }
}

// 프로세스 오류 처리
process.on('uncaughtException', (error) => {
    console.error('❌ [Starbucks] Uncaught Exception:', error);
    console.error('📍 Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ [Starbucks] Unhandled Rejection at:', promise, 'reason:', reason);
});

// 서버 시작 (동기식)
try {
    const server = startServer();
    console.log('🎯 [Starbucks] 서버 시작 프로세스 완료');
    
    // 종료 신호 처리 (Cloudtype에서 재시작할 때)
    const gracefulShutdown = (signal) => {
        console.log(`\n📡 [Starbucks] ${signal} 신호를 받았습니다. 안전하게 종료 중...`);
        server.close(() => {
            console.log('👋 [Starbucks] 서버가 안전하게 종료되었습니다.');
            process.exit(0);
        });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
} catch (error) {
    console.error('❌ [Starbucks] 서버 시작 중 예상치 못한 오류:', error);
    process.exit(1);
}


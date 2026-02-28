/**
 * Starbucks Homepage - Main Server Entry Point
 *
 * Firebase 기반 백엔드. 정적 파일 + /api/firebase-config 등 API 제공.
 */

console.log('🚀 [Starbucks] Starbucks Homepage 서버를 시작합니다...');
console.log('📁 [Starbucks] 메인 서버 로직: server/app.js');
console.log('🔥 [Starbucks] Firebase 기반 백엔드');

try {
    require('dotenv').config({ path: './.env' });
    console.log('📄 [Starbucks] .env 파일 로드 완료');
} catch (error) {
    console.log('📄 [Starbucks] .env 파일 없음 (배포 환경에서는 정상)');
}

console.log('🔍 [Starbucks] 환경변수 확인:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   PORT:', process.env.PORT || '3000 (기본값)');

console.log('\n🔥 [Firebase] Firebase 설정:');
console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ 설정됨' : '❌ 설정 안됨');
console.log('   FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✅ 설정됨' : '❌ 설정 안됨');
console.log('   FIREBASE_AUTH_DOMAIN:', process.env.FIREBASE_AUTH_DOMAIN ? '✅ 설정됨' : '❌ 설정 안됨');

const app = require('./server/app.js');
const PORT = process.env.PORT || 3000;

function startServer() {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('\n🎉 ================================');
        console.log('🚀 [Starbucks] 서버 시작 완료!');
        console.log('🌐 [Starbucks] 주소: 0.0.0.0:' + PORT);
        console.log('📝 [Starbucks] 환경:', process.env.NODE_ENV || 'development');
        console.log('⏰ [Starbucks] 시작 시간:', new Date().toISOString());
        console.log('================================ 🎉\n');

        console.log('📖 [Starbucks] 엔드포인트:');
        console.log('   🏠 GET  /ping              - 연결 테스트');
        console.log('   🏠 GET  /                   - 메인 홈페이지');
        console.log('   📡 GET  /api                - API 정보');
        console.log('   ❤️  GET  /api/health        - 서버 상태');
        console.log('   🔥 GET  /api/firebase-status - Firebase 상태');
        console.log('   🔥 GET  /api/firebase-config - Firebase 설정 (클라이언트용)');
    });

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

process.on('uncaughtException', (error) => {
    console.error('❌ [Starbucks] Uncaught Exception:', error);
    console.error('📍 Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ [Starbucks] Unhandled Rejection at:', promise, 'reason:', reason);
});

try {
    const server = startServer();

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
    console.error('❌ [Starbucks] 서버 시작 중 오류:', error);
    process.exit(1);
}

/**
 * Starbucks Homepage - Main Server Entry Point
 * 
 * 이 파일은 하위 호환성을 위해 유지되며,
 * 실제 서버 로직은 server/app.js에서 처리됩니다.
 * 
 * 사용법:
 * - node index.js (이 파일 실행)
 * - npm start (server/app.js 직접 실행 - 권장)
 * - npm run dev (개발 모드)
 */

console.log('🚀 [Starbucks] Starbucks Homepage 서버를 시작합니다...');
console.log('📁 [Starbucks] 메인 서버 로직: server/app.js');
console.log('🔄 [Starbucks] 스마트 MongoDB 연결 활성화');

// 환경변수 로드 (프로젝트 루트의 .env 파일)
require('dotenv').config({ path: './.env' });

// 메인 서버 애플리케이션 시작
require('./server/app.js');

console.log('✅ [Starbucks] 서버 초기화 완료');

// 안내 메시지
setTimeout(() => {
    console.log('\n📖 [Starbucks] 사용 가능한 명령어:');
    console.log('   npm start      - 서버 시작 (프로덕션)');
    console.log('   npm run dev    - 서버 시작 (개발 모드)');
    console.log('   npm run health - 헬스 체크');
    console.log('\n🌐 [Starbucks] API 엔드포인트:');
    console.log('   GET  /api/health     - 서버 상태 확인');
    console.log('   GET  /api           - API 정보');
    console.log('   POST /api/auth/register - 회원가입');
    console.log('   POST /api/auth/login    - 로그인');
}, 2000);


/**
 * MongoDB 연결 사용 예제
 * 
 * 환경변수 설정 방법:
 * 1. MONGO_ATLAS_URI가 있으면 → Atlas 사용
 * 2. MONGO_ATLAS_URI가 없으면 → 로컬 MongoDB 사용
 */

const { connect, disconnect, isConnected } = require('./database');

// 간단한 스키마 예제
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

/**
 * 데이터베이스 작업 예제
 */
async function exampleUsage() {
    try {
        // 1. 데이터베이스 연결
        await connect();
        
        console.log('🔍 연결 상태:', isConnected() ? '연결됨' : '연결 안됨');

        // 2. 데이터 생성 예제
        const newUser = new User({
            name: '테스트 사용자',
            email: 'test@example.com'
        });

        // 중복 이메일 체크 (예제용)
        const existingUser = await User.findOne({ email: newUser.email });
        if (existingUser) {
            console.log('👤 기존 사용자가 이미 존재합니다.');
        } else {
            await newUser.save();
            console.log('✅ 새 사용자가 생성되었습니다:', newUser.name);
        }

        // 3. 데이터 조회 예제
        const users = await User.find().limit(5);
        console.log('📋 사용자 목록 (최대 5명):');
        users.forEach(user => {
            console.log(`  - ${user.name} (${user.email})`);
        });

        // 4. 연결 상태 최종 확인
        console.log('🔍 최종 연결 상태:', isConnected() ? '✅ 연결됨' : '❌ 연결 안됨');

    } catch (error) {
        console.error('❌ 작업 중 오류 발생:', error.message);
    } finally {
        // 5. 연결 해제
        await disconnect();
    }
}

// 환경변수 설정 상태 출력
console.log('\n📋 현재 환경변수 설정 상태:');
console.log('MONGO_ATLAS_URI:', process.env.MONGO_ATLAS_URI ? '✅ 설정됨' : '❌ 설정 안됨');
console.log('MONGO_LOCAL_URI:', process.env.MONGO_LOCAL_URI ? '✅ 설정됨' : '❌ 설정 안됨');
console.log('\n🚀 MongoDB 연결 테스트를 시작합니다...\n');

// 스크립트 실행
if (require.main === module) {
    exampleUsage().catch(console.error);
}

module.exports = {
    User,
    exampleUsage
};
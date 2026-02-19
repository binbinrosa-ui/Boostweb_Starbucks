const mongoose = require('mongoose');
require('dotenv').config();

/**
 * MongoDB 연결 설정
 * MONGO_ATLAS_URI가 있으면 Atlas 사용, 없으면 로컬 MongoDB 사용
 */
class DatabaseConnection {
    constructor() {
        this.connectionString = this.getConnectionString();
        this.isConnected = false;
    }

    /**
     * 환경변수에 따라 적절한 MongoDB 연결 문자열 반환
     * @returns {string} MongoDB 연결 문자열
     */
    getConnectionString() {
        // MONGO_ATLAS_URI가 설정되어 있으면 Atlas 사용 (우선순위)
        if (process.env.MONGO_ATLAS_URI) {
            console.log('🌐 MongoDB Atlas 연결을 사용합니다.');
            return process.env.MONGO_ATLAS_URI;
        }
        
        // Atlas URI가 없으면 로컬 MongoDB 사용
        if (process.env.MONGO_LOCAL_URI) {
            console.log('🏠 로컬 MongoDB 연결을 사용합니다.');
            return process.env.MONGO_LOCAL_URI;
        }

        // 둘 다 없으면 기본 로컬 설정 사용
        const defaultUri = 'mongodb://localhost:27017/starbucks_local';
        console.log('⚠️  기본 로컬 MongoDB 설정을 사용합니다:', defaultUri);
        return defaultUri;
    }

    /**
     * MongoDB에 연결
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            if (this.isConnected) {
                console.log('✅ 이미 MongoDB에 연결되어 있습니다.');
                return;
            }

            console.log('🔄 MongoDB 연결 중...');
            console.log('📍 연결 주소:', this.connectionString.replace(/\/\/.*@/, '//***:***@'));

            await mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // 5초 타임아웃
                socketTimeoutMS: 45000, // 45초 소켓 타임아웃
            });

            this.isConnected = true;
            console.log('✅ MongoDB 연결 성공!');
            
            // 연결 이벤트 리스너 설정
            this.setupEventListeners();

        } catch (error) {
            console.error('❌ MongoDB 연결 실패:', error.message);
            
            // Atlas 연결 실패 시 로컬로 폴백 시도
            if (process.env.MONGO_ATLAS_URI && !this.connectionString.includes('localhost')) {
                console.log('🔄 로컬 MongoDB로 폴백 시도...');
                this.connectionString = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017/starbucks_local';
                return await this.connect();
            }
            
            throw error;
        }
    }

    /**
     * MongoDB 연결 이벤트 리스너 설정
     */
    setupEventListeners() {
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB 연결 오류:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB 연결이 끊어졌습니다.');
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB 재연결되었습니다.');
            this.isConnected = true;
        });
    }

    /**
     * MongoDB 연결 해제
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('👋 MongoDB 연결이 종료되었습니다.');
        } catch (error) {
            console.error('❌ MongoDB 연결 종료 중 오류:', error.message);
            throw error;
        }
    }

    /**
     * 연결 상태 확인
     * @returns {boolean} 연결 상태
     */
    isConnectionActive() {
        return this.isConnected && mongoose.connection.readyState === 1;
    }
}

// 싱글톤 인스턴스 생성
const dbConnection = new DatabaseConnection();

// 프로세스 종료 시 연결 정리
process.on('SIGINT', async () => {
    console.log('\n🔄 프로세스 종료 중... MongoDB 연결을 정리합니다.');
    await dbConnection.disconnect();
    process.exit(0);
});

module.exports = {
    dbConnection,
    connect: () => dbConnection.connect(),
    disconnect: () => dbConnection.disconnect(),
    isConnected: () => dbConnection.isConnectionActive()
};
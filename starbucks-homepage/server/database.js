const mongoose = require('mongoose');
const path = require('path');

// 프로젝트 루트의 .env 파일 경로 지정 (server 폴더에서 상위 폴더로)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * MongoDB 연결 설정 - Starbucks Homepage
 * MONGO_ATLAS_URI가 있으면 Atlas 사용, 없으면 로컬 MongoDB 사용
 */
class DatabaseConnection {
    constructor() {
        this.connectionString = this.getConnectionString();
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    /**
     * 환경변수에 따라 적절한 MongoDB 연결 문자열 반환
     * @returns {string} MongoDB 연결 문자열
     */
    getConnectionString() {
        // 디버깅: 환경변수 상태 출력
        console.log('🔍 [Debug] 환경변수 확인:');
        console.log('   MONGO_ATLAS_URI:', process.env.MONGO_ATLAS_URI ? '✅ 존재' : '❌ 없음');
        console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ 존재' : '❌ 없음');
        console.log('   NODE_ENV:', process.env.NODE_ENV || 'undefined');
        
        // MONGO_ATLAS_URI가 설정되어 있으면 Atlas 사용 (우선순위)
        if (process.env.MONGO_ATLAS_URI && process.env.MONGO_ATLAS_URI.trim()) {
            console.log('🌐 [Starbucks] MongoDB Atlas 클라우드 연결을 사용합니다.');
            console.log('🔍 [Debug] Atlas URI 길이:', process.env.MONGO_ATLAS_URI.trim().length);
            return process.env.MONGO_ATLAS_URI.trim();
        }
        
        // Atlas URI가 없으면 로컬 MongoDB 사용
        if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
            console.log('🏠 [Starbucks] 로컬 MongoDB 연결을 사용합니다.');
            return process.env.MONGODB_URI.trim();
        }

        // 둘 다 없으면 기본 로컬 설정 사용
        const defaultUri = 'mongodb://localhost:27017/starbucks';
        console.log('⚠️  [Starbucks] 기본 로컬 MongoDB 설정을 사용합니다:', defaultUri);
        return defaultUri;
    }

    /**
     * MongoDB에 연결
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            if (this.isConnected) {
                console.log('✅ [Starbucks] 이미 MongoDB에 연결되어 있습니다.');
                return mongoose.connection;
            }

            console.log('🔄 [Starbucks] MongoDB 연결 중...');
            console.log('📍 [Starbucks] 연결 주소:', this.maskConnectionString(this.connectionString));

            await mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000, // 10초 타임아웃
                socketTimeoutMS: 45000, // 45초 소켓 타임아웃
                maxPoolSize: 10, // 최대 연결 풀 크기
                minPoolSize: 2, // 최소 연결 풀 크기
                retryWrites: true,
                w: 'majority'
            });

            this.isConnected = true;
            this.retryCount = 0;
            console.log('✅ [Starbucks] MongoDB 연결 성공!');
            console.log(`📊 [Starbucks] 데이터베이스: ${mongoose.connection.name}`);
            
            // 연결 이벤트 리스너 설정
            this.setupEventListeners();
            
            return mongoose.connection;

        } catch (error) {
            console.error('❌ [Starbucks] MongoDB 연결 실패:', error.message);
            
            // Atlas 연결 실패 시 로컬로 폴백 시도
            if (process.env.MONGO_ATLAS_URI && 
                !this.connectionString.includes('localhost') && 
                this.retryCount < this.maxRetries) {
                
                console.log('🔄 [Starbucks] 로컬 MongoDB로 폴백 시도...');
                this.retryCount++;
                this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/starbucks';
                return await this.connect();
            }
            
            throw error;
        }
    }

    /**
     * MongoDB 연결 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 이미 리스너가 설정되었다면 중복 설정 방지
        if (mongoose.connection._events && mongoose.connection._events.error) {
            return;
        }

        mongoose.connection.on('error', (error) => {
            console.error('❌ [Starbucks] MongoDB 연결 오류:', error.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  [Starbucks] MongoDB 연결이 끊어졌습니다.');
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 [Starbucks] MongoDB 재연결되었습니다.');
            this.isConnected = true;
        });

        mongoose.connection.on('connected', () => {
            console.log('🔗 [Starbucks] MongoDB 연결 이벤트 감지됨');
        });
    }

    /**
     * 연결 문자열에서 비밀번호 마스킹
     * @param {string} connectionString 
     * @returns {string}
     */
    maskConnectionString(connectionString) {
        return connectionString.replace(/\/\/.*@/, '//***:***@');
    }

    /**
     * MongoDB 연결 해제
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            if (!this.isConnected) {
                console.log('ℹ️  [Starbucks] MongoDB 연결이 이미 해제되어 있습니다.');
                return;
            }

            await mongoose.disconnect();
            this.isConnected = false;
            console.log('👋 [Starbucks] MongoDB 연결이 안전하게 종료되었습니다.');
        } catch (error) {
            console.error('❌ [Starbucks] MongoDB 연결 종료 중 오류:', error.message);
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

    /**
     * 연결 정보 반환
     * @returns {object} 연결 정보
     */
    getConnectionInfo() {
        return {
            isConnected: this.isConnectionActive(),
            database: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            readyState: mongoose.connection.readyState,
            connectionString: this.maskConnectionString(this.connectionString)
        };
    }
}

// 싱글톤 인스턴스 생성
const dbConnection = new DatabaseConnection();

// 프로세스 종료 시 연결 정리
const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 [Starbucks] ${signal} 신호 감지됨. 서버를 안전하게 종료합니다...`);
    try {
        await dbConnection.disconnect();
        console.log('✅ [Starbucks] 데이터베이스 연결이 정리되었습니다.');
        process.exit(0);
    } catch (error) {
        console.error('❌ [Starbucks] 종료 중 오류:', error.message);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = {
    dbConnection,
    connect: () => dbConnection.connect(),
    disconnect: () => dbConnection.disconnect(),
    isConnected: () => dbConnection.isConnectionActive(),
    getConnectionInfo: () => dbConnection.getConnectionInfo()
};
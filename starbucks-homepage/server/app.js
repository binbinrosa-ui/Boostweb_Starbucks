const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 스마트 MongoDB 연결 모듈 import
const { connect, getConnectionInfo } = require('./database');

const app = express();

// 미들웨어 설정
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '..')));

// 스마트 MongoDB 연결 초기화
async function initializeDatabase() {
    try {
        await connect();
        const info = getConnectionInfo();
        console.log('📊 [Starbucks] 데이터베이스 연결 정보:', {
            database: info.database,
            isConnected: info.isConnected,
            connectionType: info.connectionString.includes('mongodb+srv') ? 'Atlas (클라우드)' : '로컬'
        });
    } catch (error) {
        console.error('❌ [Starbucks] 데이터베이스 초기화 실패:', error.message);
        if (process.env.NODE_ENV !== 'development') {
            process.exit(1); // 프로덕션에서는 DB 연결 실패 시 종료
        }
    }
}

// API 라우트
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 데이터베이스 상태 확인 엔드포인트 (개발용)
app.get('/api/db-status', async (req, res) => {
    try {
        const User = require('./models/User');
        const info = getConnectionInfo();
        
        // 사용자 수 확인
        const userCount = await User.countDocuments();
        
        // 최근 사용자 목록 (최대 5명)
        const recentUsers = await User.find()
            .select('email name user_type createdAt')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            success: true,
            database: {
                connected: info.isConnected,
                name: info.database,
                type: info.connectionString.includes('mongodb+srv') ? 'MongoDB Atlas (클라우드)' : '로컬 MongoDB',
                connectionString: info.connectionString.replace(/\/\/.*@/, '//***:***@')
            },
            users: {
                totalCount: userCount,
                recentUsers: recentUsers.map(user => ({
                    email: user.email,
                    name: user.name,
                    user_type: user.user_type,
                    createdAt: user.createdAt
                }))
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('DB Status check error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            database: {
                connected: false
            }
        });
    }
});

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
    const info = getConnectionInfo();
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: {
            environment: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3000,
            uptime: process.uptime()
        },
        database: {
            connected: info.isConnected,
            name: info.database,
            readyState: info.readyState,
            type: info.connectionString.includes('mongodb+srv') ? 'MongoDB Atlas (클라우드)' : '로컬 MongoDB'
        }
    });
});

// API 상태 엔드포인트
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Starbucks Korea API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                checkEmail: 'GET /api/auth/check-email'
            }
        }
    });
});

// 기본 라우트 - 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('에러:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '서버 오류가 발생했습니다.'
    });
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '요청한 리소스를 찾을 수 없습니다.'
    });
});

// 서버 시작 함수
async function startServer() {
    const PORT = process.env.PORT || 3000;
    
    try {
        // 1. 데이터베이스 연결
        await initializeDatabase();
        
        // 2. 서버 시작
        app.listen(PORT, () => {
            console.log(`🚀 [Starbucks] 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`🌍 [Starbucks] 웹사이트: http://localhost:${PORT}`);
            console.log(`🔗 [Starbucks] API: http://localhost:${PORT}/api`);
            console.log(`📝 [Starbucks] 환경: ${process.env.NODE_ENV || 'development'}`);
            
            // 연결 정보 표시
            setTimeout(() => {
                const info = getConnectionInfo();
                console.log('✅ [Starbucks] 시스템 준비 완료!');
                console.log(`📊 [Starbucks] DB 상태: ${info.isConnected ? '연결됨' : '연결 안됨'}`);
            }, 1000);
        });
        
    } catch (error) {
        console.error('❌ [Starbucks] 서버 시작 실패:', error.message);
        process.exit(1);
    }
}

// 메인 실행부
if (require.main === module) {
    startServer().catch(console.error);
}

module.exports = app;


const express = require('express');
const cors = require('cors');
const path = require('path');
// 환경변수는 index.js에서 로드됨

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

// 요청 로깅 미들웨어 (개발/디버깅용)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`📥 [${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// 정적 파일 제공 (프로젝트 루트 디렉토리)
app.use(express.static(path.join(__dirname, '..'), {
    index: false, // 자동 index.html 서비스 비활성화 (수동 라우팅 사용)
    dotfiles: 'ignore', // 숨김 파일 무시
    setHeaders: (res, path) => {
        // 캐싱 헤더 설정
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// favicon 처리 (404 대신 빈 응답)
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No Content
});

// MongoDB 연결은 index.js에서 처리

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

// 헬스 체크 엔드포인트 (DB 연결 상태와 무관하게 작동)
app.get('/api/health', (req, res) => {
    try {
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
            database: info ? {
                connected: info.isConnected,
                name: info.database || 'unknown',
                readyState: info.readyState,
                type: info.connectionString && info.connectionString.includes('mongodb+srv') ? 'MongoDB Atlas (클라우드)' : '로컬 MongoDB'
            } : {
                connected: false,
                status: 'not_initialized'
            }
        });
    } catch (error) {
        // DB 연결 정보를 가져올 수 없어도 서버는 정상
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
                connected: false,
                status: 'connection_info_unavailable'
            }
        });
    }
});

// 기본 라우트 - 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 간단한 ping 엔드포인트 (가장 기본적인 응답 테스트)
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// API 기본 응답 (연결 테스트용)
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Starbucks Korea API Server',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            ping: '/ping',
            health: '/api/health',
            dbStatus: '/api/db-status',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                checkEmail: 'GET /api/auth/check-email'
            }
        }
    });
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

// Express 앱 export (서버 시작은 index.js에서 처리)
module.exports = app;


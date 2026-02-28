const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`📥 [${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

app.use(express.static(path.join(__dirname, '..'), {
    index: false,
    dotfiles: 'ignore',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

const firebaseAuthRoutes = require('./routes/firebase-auth');
app.use('/api/firebase-auth', firebaseAuthRoutes);

app.get('/api/firebase-status', (req, res) => {
    try {
        res.json({
            success: true,
            firebase: {
                status: 'configured',
                services: {
                    authentication: 'enabled',
                    firestore: 'enabled',
                    analytics: 'enabled'
                },
                project: {
                    id: process.env.FIREBASE_PROJECT_ID || 'not-configured',
                    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'not-configured'
                },
                console_links: {
                    authentication: `https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/authentication/users`,
                    firestore: `https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/firestore/databases`,
                    analytics: `https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/analytics`
                }
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Firebase status check error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            firebase: { status: 'error' }
        });
    }
});

app.get('/api/db-status', (req, res) => {
    res.redirect(301, '/api/firebase-status');
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: {
            environment: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3000,
            uptime: process.uptime()
        },
        backend: 'firebase',
        firebase_status_endpoint: '/api/firebase-status'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Starbucks Korea API Server',
        version: '1.0.0',
        status: 'running',
        backend: 'firebase',
        timestamp: new Date().toISOString(),
        endpoints: {
            ping: '/ping',
            health: '/api/health',
            firebase_status: 'GET /api/firebase-status',
            firebase_config: 'GET /api/firebase-config',
            firebase_auth: 'GET /api/firebase-auth/*'
        }
    });
});

app.get('/api/firebase-config', (req, res) => {
    try {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

        const missingKeys = Object.entries(firebaseConfig)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingKeys.length > 0) {
            return res.status(500).json({
                success: false,
                message: 'Firebase 설정이 불완전합니다.',
                missingKeys: missingKeys
            });
        }

        res.json({
            success: true,
            config: firebaseConfig,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Firebase config error:', error);
        res.status(500).json({
            success: false,
            message: 'Firebase 설정을 가져올 수 없습니다.',
            error: error.message
        });
    }
});

app.use((err, req, res, next) => {
    console.error('에러:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '서버 오류가 발생했습니다.'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '요청한 리소스를 찾을 수 없습니다.'
    });
});

module.exports = app;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 환경 변수에서 JWT 시크릿 가져오기
const JWT_SECRET = process.env.JWT_SECRET || 'starbucks-secret-key-change-in-production';

// 이메일 중복 확인
router.get('/check-email', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: '이메일을 입력해주세요.' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        res.json({
            success: true,
            exists: !!user
        });
    } catch (error) {
        console.error('Email check error:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 회원가입
router.post('/register', async (req, res) => {
    try {
        const { email, name, password, address } = req.body;

        // 필수 필드 검증
        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: '필수 항목을 모두 입력해주세요.'
            });
        }

        // 이메일 중복 확인
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.'
            });
        }

        // 비밀번호 강도 검증
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 최소 8자 이상이어야 합니다.'
            });
        }

        // 관리자 이메일 목록 (환경변수에서 가져오거나 기본값 사용)
        const adminEmails = process.env.ADMIN_EMAILS 
            ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
            : [];
        
        // 이메일 주소를 기반으로 사용자 유형 결정
        const userEmail = email.toLowerCase();
        let userType = '고객'; // 기본값은 고객
        
        if (adminEmails.includes(userEmail)) {
            userType = '관리자';
        }

        // 새 사용자 생성
        const newUser = new User({
            email: userEmail,
            name: name.trim(),
            password: password,
            user_type: userType,
            address: address ? address.trim() : null
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                user_type: newUser.user_type,
                address: newUser.address,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // 필수 필드 검증
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '이메일과 비밀번호를 입력해주세요.'
            });
        }

        // 사용자 찾기 (비밀번호 포함)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 비밀번호 확인
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                user_type: user.user_type
            },
            JWT_SECRET,
            { 
                expiresIn: rememberMe ? '30d' : '1d' // 로그인 상태 유지: 30일, 일반: 1일
            }
        );

        res.json({
            success: true,
            message: '로그인 성공',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                user_type: user.user_type,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});

module.exports = router;


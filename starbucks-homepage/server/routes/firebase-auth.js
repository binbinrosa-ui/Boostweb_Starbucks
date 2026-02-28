/**
 * Firebase Authentication Routes
 * Firebase Admin SDK를 사용한 서버사이드 인증 처리
 */

const express = require('express');
const router = express.Router();

// Note: Firebase Authentication은 주로 클라이언트 사이드에서 처리됩니다.
// 이 파일은 필요시 Firebase Admin SDK 기능을 위한 확장용입니다.

// 사용자 정보 조회 (Firebase UID 기반)
router.get('/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        // Firebase Admin SDK를 사용할 경우 여기서 사용자 정보 조회
        // 현재는 클라이언트에서 직접 Firebase Auth 사용을 권장
        
        res.json({
            success: true,
            message: 'Firebase Authentication은 클라이언트에서 직접 처리됩니다.',
            uid: uid,
            note: 'Firebase Console에서 사용자 정보를 확인하세요.'
        });
    } catch (error) {
        console.error('Firebase user info error:', error);
        res.status(500).json({
            success: false,
            message: '사용자 정보를 가져올 수 없습니다.',
            error: error.message
        });
    }
});

// Firebase 사용자 목록 조회 (관리자용)
router.get('/users', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Firebase Console에서 사용자 목록을 확인하세요.',
            console_url: 'https://console.firebase.google.com/project/boostweb-starbucks/authentication/users',
            note: 'Authentication > Users 탭에서 모든 사용자 정보를 볼 수 있습니다.'
        });
    } catch (error) {
        console.error('Firebase users list error:', error);
        res.status(500).json({
            success: false,
            message: '사용자 목록을 가져올 수 없습니다.'
        });
    }
});

module.exports = router;
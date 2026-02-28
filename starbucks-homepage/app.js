/**
 * Starbucks Homepage - Firebase Configuration
 * Firebase 설정을 서버에서 안전하게 가져와서 초기화하는 모듈
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Firebase 인스턴스를 저장할 변수들
let app = null;
let analytics = null;
let db = null;
let auth = null;

/**
 * Firebase 설정 (클라이언트 직접 사용)
 */
function getFirebaseConfig() {
    return {
        apiKey: "AIzaSyCbFPgd4R5YNo9cjsM1C3CT1e2GQCJwzIA",
        authDomain: "boostweb-starbucks.firebaseapp.com",
        projectId: "boostweb-starbucks",
        storageBucket: "boostweb-starbucks.firebasestorage.app",
        messagingSenderId: "792102076364",
        appId: "1:792102076364:web:388518e732b80d28d0e769",
        measurementId: "G-TMDRQTD9RG"
    };
}

/**
 * Firebase 초기화 함수 (서버 의존성 제거)
 */
async function initializeFirebase() {
    try {
        console.log('🔄 [Firebase] 클라이언트에서 직접 초기화 중...');
        
        // 클라이언트에서 Firebase 설정 직접 사용
        const firebaseConfig = getFirebaseConfig();
        
        console.log('✅ [Firebase] 클라이언트 설정 로드 성공');
        console.log('🔍 [Firebase] 프로젝트 ID:', firebaseConfig.projectId);
        
        // Firebase 앱 초기화
        app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
        db = getFirestore(app);
        auth = getAuth(app);
        
        console.log('🔥 [Firebase] Firebase Analytics 초기화 완료');
        console.log('💾 [Firebase] Firestore 데이터베이스 초기화 완료');
        console.log('🔐 [Firebase] Authentication 초기화 완료');
        
        // 전역 변수로 설정 (로그인 페이지에서 초기화 상태 확인용)
        window.auth = auth;
        window.db = db;
        
        return { app, analytics, db, auth };
        
    } catch (error) {
        console.error('❌ [Firebase] 초기화 실패:', error.message);
        
        // 오류 처리 안내
        console.log('💡 [Firebase] 문제 해결 방법:');
        console.log('1. 인터넷 연결을 확인하세요');
        console.log('2. Firebase 프로젝트 설정이 올바른지 확인하세요');
        console.log('3. 브라우저 캐시를 삭제하고 다시 시도하세요');
        
        throw error;
    }
}

// Firebase 초기화 실행
initializeFirebase()
    .then(() => {
        console.log('🎉 [Firebase] 모든 초기화 완료!');
        
        // Firebase 준비 완료 이벤트 발생
        window.dispatchEvent(new CustomEvent('firebase-ready'));
    })
    .catch((error) => {
        console.error('🚨 [Firebase] 초기화 중 오류 발생:', error);
    });

// Firebase 유틸리티 함수들
export {
    app, analytics, db, auth, initializeFirebase,
    // Firestore 함수들
    collection, addDoc, getDocs, query, where, orderBy, limit,
    // Auth 함수들
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged
};
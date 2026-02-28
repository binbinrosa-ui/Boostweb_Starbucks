/**
 * Auth State Management - 인증 상태 관리
 * 헤더의 로그인/로그아웃 버튼 상태를 Firebase 인증 상태에 따라 동적으로 변경
 */

import { 
    auth, 
    onAuthStateChanged 
} from '../app.js';

/**
 * 헤더 인증 상태 초기화
 */
function initializeAuthState() {
    console.log('🔄 [AuthState] 인증 상태 관리 초기화');
    
    // Firebase 인증 상태 변화 감지
    onAuthStateChanged(auth, (user) => {
        updateHeaderButtons(user);
    });
}

/**
 * 헤더 버튼 상태 업데이트
 */
function updateHeaderButtons(user) {
    const authButton = document.getElementById('authButton');
    const myStarbucksButton = document.getElementById('myStarbucksButton');
    
    if (!authButton || !myStarbucksButton) {
        // 헤더가 아직 로드되지 않았을 수 있음
        setTimeout(() => updateHeaderButtons(user), 100);
        return;
    }
    
    if (user) {
        // 로그인된 상태
        console.log('✅ [AuthState] 사용자 로그인 상태 - UI 업데이트');
        
        authButton.textContent = 'Logout';
        authButton.href = '#';
        authButton.addEventListener('click', handleLogout);
        
        myStarbucksButton.style.display = 'inline';
        myStarbucksButton.href = 'mypage.html';
        
    } else {
        // 로그아웃된 상태
        console.log('❌ [AuthState] 사용자 로그아웃 상태 - UI 업데이트');
        
        authButton.textContent = 'Sign In';
        authButton.href = 'login.html';
        authButton.removeEventListener('click', handleLogout);
        
        // My Starbucks 버튼을 로그인 페이지로 리디렉션하거나 숨김
        myStarbucksButton.href = 'login.html';
        myStarbucksButton.title = '로그인이 필요합니다';
    }
}

/**
 * 로그아웃 처리
 */
async function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('정말로 로그아웃 하시겠습니까?')) {
        try {
            const { firebaseLogout } = await import('./firebase-auth.js');
            const result = await firebaseLogout();
            
            if (result.success) {
                console.log('✅ [AuthState] 로그아웃 성공');
                
                // 메인 페이지로 이동
                window.location.href = 'index.html';
            } else {
                console.error('❌ [AuthState] 로그아웃 실패:', result.message);
                alert('로그아웃에 실패했습니다: ' + result.message);
            }
        } catch (error) {
            console.error('❌ [AuthState] 로그아웃 오류:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    }
}

/**
 * 페이지별 인증 상태 확인
 */
function checkAuthForPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 마이페이지인 경우 로그인 확인
    if (currentPage === 'mypage.html') {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                console.log('❌ [AuthState] 마이페이지 접근 - 로그인 필요');
                alert('로그인이 필요한 페이지입니다.');
                window.location.href = 'login.html';
            }
        });
    }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 헤더 컴포넌트가 로드될 때까지 대기
    const checkHeader = () => {
        if (document.getElementById('authButton') && document.getElementById('myStarbucksButton')) {
            initializeAuthState();
            checkAuthForPage();
        } else {
            setTimeout(checkHeader, 100);
        }
    };
    
    checkHeader();
});

// Firebase 인증이 준비되면 실행
window.addEventListener('firebase-ready', () => {
    initializeAuthState();
    checkAuthForPage();
});

console.log('✅ [AuthState] 인증 상태 관리 모듈 로드 완료');
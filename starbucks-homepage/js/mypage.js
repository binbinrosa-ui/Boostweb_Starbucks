/**
 * MyPage JavaScript - Firebase 기반 사용자 정보 관리
 * 마이페이지에서 사용자 정보 조회, 수정, 비밀번호 변경 등의 기능
 */

import { 
    auth, db, 
    onAuthStateChanged, 
    signOut,
    collection, 
    query, 
    where, 
    getDocs,
    updateDoc,
    doc
} from '../app.js';

import { 
    firebaseLogout,
    getCurrentUser
} from './firebase-auth.js';

// 전역 변수
let currentUserData = null;
let currentUserDocId = null;

/**
 * 페이지 로드 시 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 [MyPage] 마이페이지 초기화 중...');
    
    // 인증 상태 확인
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✅ [MyPage] 로그인된 사용자:', user.uid);
            loadUserData(user);
        } else {
            console.log('❌ [MyPage] 로그인되지 않은 사용자 - 로그인 페이지로 이동');
            // 로그인되지 않은 경우 로그인 페이지로 리디렉션
            window.location.href = 'login.html';
        }
    });

    // 이벤트 리스너 초기화
    initializeEventListeners();
});

/**
 * Firebase에서 사용자 데이터 로드
 */
async function loadUserData(user) {
    try {
        console.log('🔄 [MyPage] 사용자 데이터 로드 중...');
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            currentUserData = userDoc.data();
            currentUserDocId = userDoc.id;
            
            console.log('✅ [MyPage] 사용자 데이터 로드 성공:', currentUserData);
            
            // UI에 사용자 정보 표시
            displayUserInfo(currentUserData);
        } else {
            console.log('⚠️ [MyPage] Firestore에 사용자 정보가 없음');
            // 기본 정보만 표시
            displayUserInfo({
                name: user.displayName || '사용자',
                email: user.email,
                address: '',
                phone: '',
                birthdate: ''
            });
        }
    } catch (error) {
        console.error('❌ [MyPage] 사용자 데이터 로드 실패:', error);
        showErrorMessage('사용자 정보를 불러오는데 실패했습니다.');
    }
}

/**
 * UI에 사용자 정보 표시
 */
function displayUserInfo(userData) {
    console.log('🔄 [MyPage] UI에 사용자 정보 표시:', userData);
    
    // 사이드바에 사용자 정보 표시
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserEmail = document.getElementById('sidebarUserEmail');
    
    if (sidebarUserName) sidebarUserName.textContent = userData.name || '사용자';
    if (sidebarUserEmail) sidebarUserEmail.textContent = userData.email || '';
    
    // 프로필 폼에 데이터 입력
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAddress = document.getElementById('profileAddress');
    const profilePhone = document.getElementById('profilePhone');
    const profileBirthdate = document.getElementById('profileBirthdate');
    
    if (profileName) profileName.value = userData.name || '';
    if (profileEmail) profileEmail.value = userData.email || '';
    if (profileAddress) profileAddress.value = userData.address || '';
    if (profilePhone) profilePhone.value = userData.phone || '';
    if (profileBirthdate) profileBirthdate.value = userData.birthdate || '';
}

/**
 * 이벤트 리스너 초기화
 */
function initializeEventListeners() {
    console.log('🔄 [MyPage] 이벤트 리스너 초기화 중...');
    
    // 사이드바 메뉴 클릭 이벤트
    initializeSidebarNavigation();
    
    // 프로필 수정 폼 이벤트
    initializeProfileForm();
    
    // 비밀번호 변경 폼 이벤트
    initializePasswordForm();
    
    // 로그아웃 버튼 이벤트
    initializeLogoutButton();
    
    // 비밀번호 보기/숨기기 토글
    initializePasswordToggles();
}

/**
 * 사이드바 네비게이션 초기화
 */
function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
    const contentSections = document.querySelectorAll('.mypage-content');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // 사이드바 활성화 상태 변경
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // 콘텐츠 섹션 표시/숨기기
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection + 'Section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

/**
 * 프로필 수정 폼 초기화
 */
function initializeProfileForm() {
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const profileData = {
                name: document.getElementById('profileName').value.trim(),
                address: document.getElementById('profileAddress').value.trim(),
                phone: document.getElementById('profilePhone').value.trim(),
                birthdate: document.getElementById('profileBirthdate').value,
                updatedAt: new Date()
            };
            
            await updateUserProfile(profileData);
        });
    }
}

/**
 * 비밀번호 변경 폼 초기화
 */
function initializePasswordForm() {
    const passwordForm = document.getElementById('passwordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');
    
    // 비밀번호 일치 확인
    if (newPassword && confirmPassword && passwordMatchMessage) {
        function checkPasswordMatch() {
            if (confirmPassword.value) {
                if (newPassword.value === confirmPassword.value) {
                    passwordMatchMessage.innerHTML = '<small class="text-success"><i class="fas fa-check"></i> 비밀번호가 일치합니다.</small>';
                } else {
                    passwordMatchMessage.innerHTML = '<small class="text-danger"><i class="fas fa-times"></i> 비밀번호가 일치하지 않습니다.</small>';
                }
            } else {
                passwordMatchMessage.innerHTML = '';
            }
        }
        
        newPassword.addEventListener('input', checkPasswordMatch);
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }
    
    // 비밀번호 변경 폼 제출
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showErrorMessage('새 비밀번호가 일치하지 않습니다.');
                return;
            }
            
            await changePassword(currentPassword, newPassword);
        });
    }
}

/**
 * 로그아웃 버튼 초기화
 */
function initializeLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (confirm('정말로 로그아웃 하시겠습니까?')) {
                await handleLogout();
            }
        });
    }
}

/**
 * 비밀번호 보기/숨기기 토글 초기화
 */
function initializePasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput) {
                const type = targetInput.getAttribute('type') === 'password' ? 'text' : 'password';
                targetInput.setAttribute('type', type);
                
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            }
        });
    });
}

/**
 * 사용자 프로필 업데이트
 */
async function updateUserProfile(profileData) {
    try {
        console.log('🔄 [MyPage] 프로필 업데이트 시도:', profileData);
        
        if (!currentUserDocId) {
            throw new Error('사용자 문서 ID를 찾을 수 없습니다.');
        }
        
        // Firestore 문서 업데이트
        const userDocRef = doc(db, 'users', currentUserDocId);
        await updateDoc(userDocRef, profileData);
        
        // 현재 사용자 데이터 업데이트
        currentUserData = { ...currentUserData, ...profileData };
        
        console.log('✅ [MyPage] 프로필 업데이트 성공');
        
        // 사이드바 정보도 업데이트
        displayUserInfo(currentUserData);
        
        showSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
        
    } catch (error) {
        console.error('❌ [MyPage] 프로필 업데이트 실패:', error);
        showErrorMessage('프로필 업데이트에 실패했습니다: ' + error.message);
    }
}

/**
 * 비밀번호 변경
 */
async function changePassword(currentPassword, newPassword) {
    try {
        console.log('🔄 [MyPage] 비밀번호 변경 시도');
        
        // Firebase Authentication 비밀번호 변경은 복잡한 과정이 필요합니다.
        // 실제 구현에서는 reauthenticateWithCredential과 updatePassword를 사용해야 합니다.
        
        // 현재는 기본적인 UI 피드백만 제공
        showSuccessMessage('비밀번호 변경 기능은 개발 중입니다.');
        
        // 폼 리셋
        document.getElementById('passwordForm').reset();
        document.getElementById('passwordMatchMessage').innerHTML = '';
        
    } catch (error) {
        console.error('❌ [MyPage] 비밀번호 변경 실패:', error);
        showErrorMessage('비밀번호 변경에 실패했습니다: ' + error.message);
    }
}

/**
 * 로그아웃 처리
 */
async function handleLogout() {
    try {
        console.log('🔄 [MyPage] 로그아웃 시도');
        
        const result = await firebaseLogout();
        
        if (result.success) {
            console.log('✅ [MyPage] 로그아웃 성공');
            showSuccessMessage('로그아웃되었습니다.');
            
            // 잠시 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            console.error('❌ [MyPage] 로그아웃 실패:', result.message);
            showErrorMessage(result.message);
        }
        
    } catch (error) {
        console.error('❌ [MyPage] 로그아웃 오류:', error);
        showErrorMessage('로그아웃 중 오류가 발생했습니다.');
    }
}

/**
 * 성공 메시지 표시
 */
function showSuccessMessage(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    document.getElementById('successMessage').textContent = message;
    successModal.show();
}

/**
 * 오류 메시지 표시
 */
function showErrorMessage(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}

console.log('✅ [MyPage] JavaScript 모듈 로드 완료');
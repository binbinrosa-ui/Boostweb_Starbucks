/**
 * Firebase Authentication + Firestore
 * - 로그인: Firebase Authentication (이메일/비밀번호)
 * - 회원가입: Authentication 계정 생성 후, 입력 정보(이름, 이메일, 주소 등)는 Firestore 'users' 컬렉션에 저장
 */

import { 
    auth, db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    collection,
    addDoc,
    query,
    where,
    getDocs
} from '../app.js';

/**
 * Firebase 회원가입
 * 1) Firebase Authentication에 계정 생성
 * 2) Firestore 'users' 컬렉션에 입력 정보(이름, 이메일, 주소, user_type 등) 저장
 */
export async function firebaseRegister(email, password, name, address = '') {
    try {
        console.log('🔄 [Firebase Auth] 회원가입 시도:', email);
        
        // 1. Firebase Authentication으로 사용자 생성
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ [Firebase Auth] 사용자 생성 성공:', user.uid);
        
        // 2. Firestore에 회원가입 입력 정보 저장 (Authentication + Firestore)
        const userData = {
            uid: user.uid,
            email: email.toLowerCase(),
            name: (name || '').trim(),
            address: (address || '').trim() || '',
            user_type: '고객',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'users'), userData);
        console.log('✅ [Firebase Firestore] 사용자 정보 저장 완료:', docRef.id);
        
        return {
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                uid: user.uid,
                email: user.email,
                name: name,
                user_type: '고객'
            }
        };
        
    } catch (error) {
        console.error('❌ [Firebase Auth] 회원가입 실패:', error);
        
        let errorMessage = '회원가입 중 오류가 발생했습니다.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = '이미 사용 중인 이메일 주소입니다.';
                break;
            case 'auth/weak-password':
                errorMessage = '비밀번호가 너무 약합니다. 최소 6자 이상 입력해주세요.';
                break;
            case 'auth/invalid-email':
                errorMessage = '올바르지 않은 이메일 형식입니다.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = '이메일/비밀번호 회원가입이 비활성화되어 있습니다.';
                break;
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error.code
        };
    }
}

/**
 * Firebase Authentication 로그인
 * 로그인 성공 시 Firestore에서 사용자 프로필(이름, 주소, user_type) 조회 후 반환
 */
export async function firebaseLogin(email, password) {
    try {
        console.log('🔄 [Firebase Auth] 로그인 시도:', email);
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ [Firebase Auth] 로그인 성공:', user.uid);
        
        // Firestore에서 사용자 추가 정보 가져오기
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        let userData = {
            uid: user.uid,
            email: user.email,
            name: '사용자',
            user_type: '고객'
        };
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const firestoreData = userDoc.data();
            userData = {
                ...userData,
                name: firestoreData.name || '사용자',
                user_type: firestoreData.user_type || '고객',
                address: firestoreData.address || ''
            };
        }
        
        return {
            success: true,
            message: '로그인 성공',
            user: userData
        };
        
    } catch (error) {
        console.error('❌ [Firebase Auth] 로그인 실패:', error);
        
        let errorMessage = '로그인 중 오류가 발생했습니다.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = '등록되지 않은 이메일 주소입니다.';
                break;
            case 'auth/wrong-password':
                errorMessage = '비밀번호가 올바르지 않습니다.';
                break;
            case 'auth/invalid-email':
                errorMessage = '올바르지 않은 이메일 형식입니다.';
                break;
            case 'auth/user-disabled':
                errorMessage = '비활성화된 계정입니다.';
                break;
            case 'auth/too-many-requests':
                errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
                break;
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error.code
        };
    }
}

/**
 * Firebase 로그아웃
 */
export async function firebaseLogout() {
    try {
        await signOut(auth);
        console.log('✅ [Firebase Auth] 로그아웃 성공');
        return {
            success: true,
            message: '로그아웃되었습니다.'
        };
    } catch (error) {
        console.error('❌ [Firebase Auth] 로그아웃 실패:', error);
        return {
            success: false,
            message: '로그아웃 중 오류가 발생했습니다.'
        };
    }
}

/**
 * 인증 상태 변경 리스너
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * 이메일 중복 확인 (Firestore 기반)
 */
export async function checkEmailExists(email) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        return {
            success: true,
            exists: !querySnapshot.empty
        };
    } catch (error) {
        console.error('❌ [Firebase] 이메일 확인 실패:', error);
        return {
            success: false,
            message: '이메일 확인 중 오류가 발생했습니다.'
        };
    }
}
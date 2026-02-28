# 🌟 스타벅스 코리아 홈페이지 클론

현대적이고 반응형인 스타벅스 홈페이지를 구현한 풀스택 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🎯 프론트엔드
- **반응형 웹 디자인** - 모든 디바이스에서 최적화된 경험
- **모던 UI/UX** - Bootstrap 5 기반의 아름다운 인터페이스
- **인터랙티브 메뉴** - 동적 메뉴 표시 및 필터링
- **사용자 인증** - 회원가입/로그인 시스템
- **실시간 유효성 검사** - 즉시 피드백 제공

### 🚀 백엔드
- **RESTful API** - Express.js 기반 서버
- **🔥 Firebase** - 클라우드 데이터베이스 & 인증 시스템 (주요)
  - **Firebase Authentication** - 안전한 사용자 인증
  - **Cloud Firestore** - NoSQL 클라우드 데이터베이스
  - **Firebase Analytics** - 사용자 행동 분석
- **CORS 지원** - 크로스 오리진 요청 처리

## 🛠 기술 스택

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- jQuery
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- Firebase (Authentication, Firestore, Analytics)
- dotenv (환경변수)
- CORS

### DevOps & Tools
- Git & GitHub

## 📋 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/binbinrosa-ui/Boostweb_Starbucks.git
cd Boostweb_Starbucks
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 다음 정보를 입력하세요:

#### 🔥 Firebase 설정 (필수)
```env
NODE_ENV=development
PORT=3000

# Firebase 설정 (Firebase Console에서 가져오기)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### 🎯 Firebase Console에서 설정 가져오는 방법:
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택 → **프로젝트 설정** 클릭
3. **일반** 탭 → **웹앱** 설정에서 Config 정보 복사

### 4. 서버 실행
```bash
# 프로덕션 모드
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

### 5. 브라우저에서 접속
```
http://localhost:3000
```

## 📂 프로젝트 구조

```
starbucks-homepage/
├── 📁 server/                 # 백엔드 서버 (Firebase 기반)
│   ├── 📁 routes/
│   │   └── firebase-auth.js   # Firebase 인증 관련 API
│   └── app.js                 # Express 서버 설정
├── 📁 components/             # 재사용 가능한 컴포넌트
│   ├── header.html           # 헤더 컴포넌트
│   └── footer.html           # 푸터 컴포넌트
├── 📁 css/                    # 스타일시트
├── 📁 js/                     # JavaScript 파일
├── 📁 images/                 # 이미지 리소스
├── index.html                # 메인 홈페이지
├── login.html                # 로그인 페이지
├── join.html                 # 회원가입 페이지
├── menu.html                 # 메뉴 페이지
├── contact.html              # 연락처 페이지
├── package.json              # 프로젝트 설정
└── README.md                 # 프로젝트 문서
```

## 🔗 API 엔드포인트

### 🔥 Firebase 서비스 (주요)
- `GET /api/firebase-config` - Firebase 설정 가져오기
- `GET /api/firebase-status` - Firebase 서비스 상태 확인
- `GET /api/firebase-auth/users` - Firebase 사용자 관리 (관리자용)

### 📊 시스템 상태
- `GET /ping` - 기본 연결 테스트
- `GET /api` - API 정보 및 엔드포인트 목록
- `GET /api/health` - 서버 상태 확인
- `GET /api/db-status` - Firebase 상태로 리다이렉트

### 🎯 클라이언트 사이드 인증 (Firebase)
Firebase Authentication은 클라이언트에서 직접 처리됩니다:
- **회원가입**: `firebaseRegister()` 함수 사용
- **로그인**: `firebaseLogin()` 함수 사용
- **로그아웃**: `firebaseLogout()` 함수 사용

## 🌐 페이지

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈페이지 | `/` | 메인 랜딩 페이지 |
| 로그인 | `/login.html` | 사용자 로그인 |
| 회원가입 | `/join.html` | 신규 사용자 등록 |
| 메뉴 | `/menu.html` | 스타벅스 메뉴 소개 |
| 연락처 | `/contact.html` | 매장 정보 및 연락처 |

## 🔒 보안 기능

### 🔥 Firebase 보안 (메인)
- ✅ **Firebase Authentication** - Google 등급 사용자 인증
- ✅ **자동 비밀번호 해싱** - Firebase에서 자동 처리
- ✅ **실시간 보안 규칙** - Firestore 보안 규칙
- ✅ **다단계 인증 지원** - 이메일/전화 인증
- ✅ **자동 토큰 갱신** - 세션 관리 자동화

### 🛡️ 서버 보안
- ✅ **환경변수 보호** - Firebase 키 서버사이드 관리
- ✅ **CORS 설정** - 허용된 도메인만 접근
- ✅ **입력값 검증** - 클라이언트/서버 이중 검증
- ✅ **API 요청 로깅** - 보안 감사 추적

## 📱 반응형 지원

- 📱 **모바일** (320px~768px)
- 📟 **태블릿** (768px~1024px)
- 🖥 **데스크톱** (1024px+)

## 🚀 배포

### Firebase / Cloudtype 등 배포
- **환경변수**: `FIREBASE_*` 값들을 배포 플랫폼의 Environment Variables에 설정
- **시작 명령**: `node index.js` 또는 `npm start`

### Vercel 배포
```bash
# Vercel CLI 설치 후
vercel
# 환경변수는 Vercel 대시보드에서 설정
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**Rosa** - [binbinrosa-ui](https://github.com/binbinrosa-ui)

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

⭐ 이 프로젝트가 도움이 되셨다면 별점을 눌러주세요!
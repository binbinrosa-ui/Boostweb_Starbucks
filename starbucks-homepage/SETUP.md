# Starbucks Homepage 서버 설정 가이드 🚀

Firebase 기반 스타벅스 홈페이지 서버입니다.

## ✨ 주요 특징

- 🔥 **Firebase Authentication** - 회원가입/로그인
- 💾 **Cloud Firestore** - 사용자 프로필 등 데이터
- 📡 **Express 서버** - 정적 파일 + Firebase 설정 API 제공
- 🌐 **배포** - Cloudtype, Heroku, Vercel 등 (환경변수만 설정)

## 📋 사전 요구사항

- **Node.js** v14.0.0 이상
- **Firebase 프로젝트** (Console에서 생성)

## ⚡ 빠른 시작

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
프로젝트 루트에 `.env` 파일을 만들고 `.env.example`을 참고해 작성합니다.

**필수: Firebase 설정**
- [Firebase Console](https://console.firebase.google.com) → 프로젝트 설정 → 일반 → 웹앱에서 config 복사
- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` 입력

### 3. 서버 실행
```bash
npm run dev   # 개발 (자동 재시작)
npm start     # 프로덕션
```

### 4. 접속
- 메인: http://localhost:3000
- API: http://localhost:3000/api
- 헬스: http://localhost:3000/api/health
- Firebase 상태: http://localhost:3000/api/firebase-status

## 📁 프로젝트 구조

```
starbucks-homepage/
├── index.js              # 메인 엔트리 (서버 시작)
├── server/
│   ├── app.js            # Express 앱 (라우트, 정적 파일, Firebase API)
│   └── routes/
│       └── firebase-auth.js
├── js/
│   ├── firebase-auth.js  # 클라이언트 인증 (회원가입/로그인)
│   └── auth-state.js
├── index.html, login.html, join.html
└── .env                  # 환경변수 (Firebase 설정)
```

## 🔌 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/health | 서버 상태 |
| GET | /api/firebase-status | Firebase 설정/상태 |
| GET | /api/firebase-config | 클라이언트용 Firebase config |
| GET | /api/firebase-auth/* | Firebase 인증 관련 (확장용) |

인증(회원가입/로그인)은 **클라이언트**에서 Firebase SDK로 처리합니다.

## 🚀 배포 (Cloudtype 등)

1. 저장소 연결 후 빌드/시작 명령: `npm start` (또는 `node index.js`)
2. 환경변수에 Firebase 설정 추가: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID` 등
3. 포트는 배포 서비스가 할당한 `PORT` 사용 (이미 코드 반영됨)

## 🐛 문제 해결

- **Firebase 설정 오류**: `.env`의 `FIREBASE_*` 값이 Console과 일치하는지 확인
- **포트 충돌**: `.env`에서 `PORT=3001` 등으로 변경
- **의존성**: `rm -rf node_modules package-lock.json` 후 `npm install`

---

📚 [Firebase 문서](https://firebase.google.com/docs) | 🔧 [Express](https://expressjs.com/)

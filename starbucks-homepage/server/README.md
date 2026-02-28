# Starbucks Server

Firebase 기반 백엔드. Express가 정적 파일과 Firebase 설정 API를 제공합니다.

## 설치 및 실행

프로젝트 **루트**에서 실행하세요 (이 폴더만 단독 실행하지 않음):

```bash
# 루트에서
npm install
npm start
```

환경변수는 루트의 `.env`에 설정합니다. Firebase 설정(`FIREBASE_*`)이 필요합니다.

## API 엔드포인트

- **GET** `/api/health` - 서버 상태
- **GET** `/api/firebase-status` - Firebase 상태
- **GET** `/api/firebase-config` - 클라이언트용 Firebase config
- **GET** `/api/firebase-auth/*` - Firebase 인증 확장용

회원가입/로그인은 **클라이언트**에서 Firebase Authentication으로 처리됩니다.

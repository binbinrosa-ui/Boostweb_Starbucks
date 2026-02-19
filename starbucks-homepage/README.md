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
- **MongoDB Atlas** - 클라우드 데이터베이스 연동
- **JWT 인증** - 보안 토큰 기반 인증
- **비밀번호 암호화** - bcryptjs를 사용한 안전한 저장
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
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs

### DevOps & Tools
- dotenv (환경변수 관리)
- CORS (Cross-Origin Resource Sharing)
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

```env
NODE_ENV=development
PORT=3000

# MongoDB Atlas URI
MONGO_ATLAS_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# 보안 키 (실제 운영 시 복잡한 키로 변경)
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

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
├── 📁 server/                 # 백엔드 서버
│   ├── 📁 models/             # 데이터베이스 모델
│   │   └── User.js           # 사용자 모델
│   ├── 📁 routes/             # API 라우트
│   │   └── auth.js           # 인증 관련 API
│   ├── app.js                # Express 서버 설정
│   └── database.js           # MongoDB 연결 관리
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

### 인증 (Authentication)
- `GET /api/auth/check-email` - 이메일 중복 확인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 시스템
- `GET /api/health` - 서버 상태 확인
- `GET /api/db-status` - 데이터베이스 상태 확인 (개발용)

## 🌐 페이지

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈페이지 | `/` | 메인 랜딩 페이지 |
| 로그인 | `/login.html` | 사용자 로그인 |
| 회원가입 | `/join.html` | 신규 사용자 등록 |
| 메뉴 | `/menu.html` | 스타벅스 메뉴 소개 |
| 연락처 | `/contact.html` | 매장 정보 및 연락처 |

## 🔒 보안 기능

- ✅ **비밀번호 암호화** - bcryptjs 해싱
- ✅ **JWT 토큰 인증** - 안전한 세션 관리
- ✅ **입력값 검증** - SQL 인젝션 방지
- ✅ **CORS 설정** - 허용된 도메인만 접근
- ✅ **환경변수 보호** - 민감한 정보 분리

## 📱 반응형 지원

- 📱 **모바일** (320px~768px)
- 📟 **태블릿** (768px~1024px)
- 🖥 **데스크톱** (1024px+)

## 🚀 배포

### Heroku 배포
```bash
# Heroku CLI 설치 후
heroku create your-app-name
git push heroku main
heroku config:set MONGO_ATLAS_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
```

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
# Starbucks Homepage 서버 설정 가이드 🚀

스마트 MongoDB 연결 시스템과 함께하는 스타벅스 홈페이지 서버입니다.

## ✨ 주요 특징

- 🌐 **MongoDB Atlas 우선 연결** (클라우드 데이터베이스)
- 🏠 **자동 로컬 폴백** (연결 실패 시 로컬 MongoDB 사용)
- 🔄 **스마트 재연결** (연결 끊김 시 자동 복구)
- 🔒 **JWT 기반 인증** (회원가입, 로그인)
- 👨‍💼 **관리자 자동 권한** (설정된 이메일 기반)

## 📋 사전 요구사항

1. **Node.js 설치** (v14.0.0 이상)
   ```bash
   node --version
   npm --version
   ```

2. **MongoDB 준비** (둘 중 하나)
   - 🌐 MongoDB Atlas (클라우드) - **권장**
   - 🏠 로컬 MongoDB 설치

## ⚡ 초간단 시작

### 1. 패키지 설치
```bash
# 프로젝트 루트에서
npm install
```

### 2. 서버 실행
```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 또는 프로덕션 모드
npm start
```

**그게 다입니다!** 이미 MongoDB Atlas가 설정되어 있어 바로 사용 가능합니다. 🎉

## 🔧 상세 설정

### 환경변수 설정 (`server/.env`)

이미 최적화된 `.env` 파일이 생성되어 있습니다:

```env
# MongoDB Atlas (우선순위 1 - 클라우드)
MONGO_ATLAS_URI=mongodb+srv://binbinrosa_db_user:password@cluster0.bbvsoph.mongodb.net/Starbucks

# 로컬 MongoDB (Atlas 연결 실패 시 사용)
MONGODB_URI=mongodb://localhost:27017/starbucks

# 서버 설정
NODE_ENV=development
PORT=3000

# JWT 보안
JWT_SECRET=starbucks_jwt_secret_key_2026_very_secure_random_string

# 관리자 이메일 (자동 관리자 권한 부여)
ADMIN_EMAILS=admin@starbucks.kr,manager@starbucks.kr,rosa@starbucks.kr
```

### 3. 연결 시나리오

#### 🌐 시나리오 1: MongoDB Atlas 사용 (기본)
```
✅ MONGO_ATLAS_URI 설정됨
→ 자동으로 클라우드 데이터베이스 연결
→ 빠르고 안정적인 클라우드 서비스 이용
```

#### 🏠 시나리오 2: 로컬 MongoDB 사용
```
❌ MONGO_ATLAS_URI 없음 또는 연결 실패
→ 자동으로 로컬 MongoDB 연결
→ MONGODB_URI=mongodb://localhost:27017/starbucks 사용
```

#### 🔄 시나리오 3: 자동 폴백
```
❌ Atlas 연결 실패
→ 자동으로 로컬 MongoDB로 전환
→ 연결 끊김 시 자동 재연결 시도
```

### 4. 로컬 MongoDB 설치 (필요한 경우만)

**Windows:**
```bash
# Chocolatey 사용
choco install mongodb

# 또는 수동 설치
# MongoDB Community Server 다운로드 후 설치
net start MongoDB
```

**macOS:**
```bash
# Homebrew 사용
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
# MongoDB 저장소 추가
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 5. 서버 실행 및 확인

#### 서버 시작
```bash
# 개발 모드 (권장 - 파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 모드
npm start

# 하위 호환용 (index.js 사용)
node index.js
```

#### 성공 메시지 예시
```
🚀 [Starbucks] 서버가 포트 3000에서 실행 중입니다.
🌍 [Starbucks] 웹사이트: http://localhost:3000
🔗 [Starbucks] API: http://localhost:3000/api
📝 [Starbucks] 환경: development
✅ [Starbucks] 시스템 준비 완료!
📊 [Starbucks] DB 상태: 연결됨
```

#### 헬스 체크
```bash
# 서버 상태 확인
npm run health

# 또는 직접 API 호출
curl http://localhost:3000/api/health
```

### 6. 웹사이트 접속

- **메인 웹사이트**: http://localhost:3000
- **API 정보**: http://localhost:3000/api  
- **헬스 체크**: http://localhost:3000/api/health

### 7. 별도 정적 서버 (선택사항)

```bash
# 정적 파일만 서빙 (포트 8000)
npm run frontend
# 또는
npm run static
```

## 🔧 환경 변수 설명

### MONGODB_URI
- MongoDB 연결 문자열
- 기본값: `mongodb://localhost:27017/starbucks`
- 형식: `mongodb://[username:password@]host[:port]/[database]`

### PORT
- 서버가 실행될 포트 번호
- 기본값: `3000`

### JWT_SECRET
- JWT 토큰 서명에 사용되는 시크릿 키
- **중요**: 프로덕션 환경에서는 반드시 강력한 랜덤 문자열로 변경하세요
- 생성 방법: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### ADMIN_EMAILS
- 관리자로 자동 지정될 이메일 주소 목록
- 쉼표로 구분하여 여러 이메일 입력 가능
- 예: `ADMIN_EMAILS=admin@example.com,manager@example.com`
- 이 이메일로 회원가입하면 자동으로 `user_type`이 `'관리자'`로 설정됩니다

## 📁 프로젝트 구조

```
starbucks-homepage/
├── server/                 # Node.js 서버
│   ├── app.js            # Express 앱 메인 파일
│   ├── models/           # MongoDB 모델
│   │   └── User.js       # User 스키마
│   ├── routes/           # API 라우트
│   │   └── auth.js       # 인증 라우트 (회원가입, 로그인)
│   ├── package.json      # 서버 의존성
│   └── .env              # 환경 변수 (생성 필요)
├── index.html            # 메인 페이지
├── join.html             # 회원가입 페이지
├── login.html            # 로그인 페이지
└── package.json          # 프론트엔드 의존성
```

## 🔌 API 엔드포인트

### 시스템 정보

#### 🏥 헬스 체크
- **GET** `/api/health`
- 서버 및 데이터베이스 상태 확인
- 응답:
  ```json
  {
    "success": true,
    "status": "healthy",
    "timestamp": "2026-02-03T10:00:00.000Z",
    "server": {
      "environment": "development",
      "port": 3000,
      "uptime": 123.45
    },
    "database": {
      "connected": true,
      "name": "Starbucks",
      "type": "MongoDB Atlas (클라우드)"
    }
  }
  ```

#### 📋 API 정보
- **GET** `/api`
- 사용 가능한 API 엔드포인트 목록

### 🔐 인증 (Auth)

#### 이메일 중복 확인
- **GET** `/api/auth/check-email?email={email}`
- 응답: `{ success: true, exists: boolean }`

#### 회원가입
- **POST** `/api/auth/register`
- Body:
  ```json
  {
    "email": "user@example.com",
    "name": "홍길동",
    "password": "password123",
    "address": "서울시 강남구" // 선택사항
  }
  ```
- 응답: `{ success: true, message: string, user: object }`
- **자동 관리자**: `ADMIN_EMAILS`에 설정된 이메일은 자동으로 관리자 권한 부여

#### 로그인
- **POST** `/api/auth/login`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "rememberMe": false // 선택사항
  }
  ```
- 응답: `{ success: true, token: string, user: object }`

## 🐛 문제 해결

### ❌ MongoDB 연결 실패

#### Atlas 연결 문제
```bash
# 1. 네트워크 연결 확인
ping google.com

# 2. IP 화이트리스트 확인
# MongoDB Atlas > Network Access에서 현재 IP 추가

# 3. 연결 문자열 확인
# MONGO_ATLAS_URI에 올바른 username/password 설정
```

#### 로컬 MongoDB 문제
```bash
# MongoDB 서비스 상태 확인
# Windows
sc query MongoDB

# macOS/Linux
brew services list | grep mongodb
systemctl status mongod
```

#### 자동 진단
```bash
# 헬스 체크로 상태 확인
npm run health

# 또는 서버 로그 확인
npm run dev
```

### 🔧 일반적인 문제

#### 포트 충돌
```bash
# 사용 중인 포트 확인
netstat -ano | findstr :3000

# .env에서 다른 포트 사용
PORT=3001
```

#### 패키지 설치 오류
```bash
# 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 권한 문제
```bash
# 관리자 권한으로 실행 (Windows)
# 또는 sudo 사용 (macOS/Linux)
```

### 📊 로그 메시지 해석

| 메시지 | 의미 | 해결책 |
|--------|------|--------|
| `🌐 MongoDB Atlas 연결` | Atlas 사용 중 | 정상 |
| `🏠 로컬 MongoDB 연결` | 로컬 사용 중 | 정상 |
| `❌ MongoDB 연결 실패` | DB 연결 안됨 | 위 해결책 참조 |
| `✅ 시스템 준비 완료` | 모든 설정 완료 | 사용 가능 |

## 📁 프로젝트 구조

```
starbucks-homepage/
├── 📄 index.js              # 메인 엔트리 (하위 호환)
├── 📄 package.json          # 프로젝트 설정
├── 📄 SETUP.md              # 이 파일
├── 🖥️  index.html            # 메인 웹페이지
├── 🖥️  login.html            # 로그인 페이지  
├── 🖥️  join.html             # 회원가입 페이지
├── 📁 server/               # 백엔드 서버
│   ├── 📄 .env              # 환경변수 (보안)
│   ├── 📄 app.js            # Express 메인 서버
│   ├── 📄 database.js       # 스마트 MongoDB 연결
│   ├── 📄 package.json      # 서버 의존성
│   ├── 📁 models/           # 데이터 모델
│   │   └── 📄 User.js       # 사용자 스키마
│   └── 📁 routes/           # API 라우트
│       └── 📄 auth.js       # 인증 API
├── 📁 css/                 # 스타일시트
├── 📁 js/                  # 클라이언트 JavaScript
└── 📁 images/              # 이미지 파일
```

## 🚀 다음 단계

1. **사용자 기능 테스트**
   - 회원가입 페이지에서 계정 생성
   - 로그인 페이지에서 인증 확인

2. **관리자 기능**
   - `ADMIN_EMAILS`에 설정된 이메일로 가입
   - 관리자 권한 자동 부여 확인

3. **개발 확장**
   - 새로운 API 엔드포인트 추가
   - 프론트엔드 기능 확장
   - 데이터베이스 스키마 확장

## 💡 유용한 명령어

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 서버 상태 확인
npm run health

# 정적 파일만 서빙
npm run frontend

# 의존성 업데이트
npm update

# 보안 취약점 확인
npm audit
```

---

### 🆘 추가 도움이 필요하신가요?

- 📧 이슈 리포트: GitHub Issues
- 📚 MongoDB 공식 문서: [mongodb.com/docs](https://www.mongodb.com/docs/)
- 🔧 Express.js 가이드: [expressjs.com](https://expressjs.com/)

**즐거운 개발 되세요!** ☕️✨


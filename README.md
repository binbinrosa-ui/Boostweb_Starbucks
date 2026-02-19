# Stradale Starbucks Template

MongoDB를 사용하는 Starbucks 템플릿 프로젝트입니다.

## 🚀 빠른 시작

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env` 파일에서 MongoDB 설정을 확인하고 필요에 따라 수정하세요.

### 3. 프로젝트 실행
```bash
# 한 번 실행
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

## 📊 MongoDB 연결 설정

### 우선순위 체계

1. **MongoDB Atlas (클라우드)** - `MONGO_ATLAS_URI`가 설정된 경우
2. **로컬 MongoDB** - Atlas URI가 없는 경우 자동으로 로컬 사용

### 환경변수 설정

`.env` 파일에서 다음과 같이 설정되어 있습니다:

```env
# MongoDB Atlas URI (우선순위 1 - 클라우드 데이터베이스)
MONGO_ATLAS_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/database_name

# MongoDB 로컬 설정 (MONGO_ATLAS_URI가 없을 때 사용)
MONGO_LOCAL_URI=mongodb://localhost:27017/starbucks_local
MONGO_LOCAL_HOST=localhost
MONGO_LOCAL_PORT=27017
MONGO_LOCAL_DB_NAME=starbucks_local
```

### 사용 시나리오

#### 시나리오 1: MongoDB Atlas 사용
```env
MONGO_ATLAS_URI=mongodb+srv://binbinrosa_db_user:TsfA_VrU7CZw_2@@cluster0.bbvsoph.mongodb.net/Starbucks
# → Atlas 클라우드 데이터베이스에 연결
```

#### 시나리오 2: 로컬 MongoDB 사용
```env
# MONGO_ATLAS_URI=  (비워두거나 주석 처리)
MONGO_LOCAL_URI=mongodb://localhost:27017/starbucks_local
# → 로컬 MongoDB에 연결
```

#### 시나리오 3: 폴백(Fallback) 사용
Atlas 연결 실패 시 자동으로 로컬 MongoDB로 폴백됩니다.

## 💡 코드에서 사용하기

```javascript
const { connect, disconnect, isConnected } = require('./database');

async function yourFunction() {
    try {
        // MongoDB 연결
        await connect();
        
        // 연결 상태 확인
        console.log('연결됨:', isConnected());
        
        // 여기서 MongoDB 작업 수행
        // ...
        
    } catch (error) {
        console.error('오류:', error);
    } finally {
        // 연결 해제
        await disconnect();
    }
}
```

## 📁 프로젝트 구조

```
📦 Stradale/
├── 📄 .env                 # 환경변수 설정
├── 📄 .gitignore          # Git 제외 파일 설정
├── 📄 database.js         # MongoDB 연결 관리
├── 📄 example-usage.js    # 사용 예제
├── 📄 package.json        # 프로젝트 설정
└── 📄 README.md           # 이 파일
```

## 🛠️ 로컬 MongoDB 설치 (필요한 경우)

### Windows
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) 다운로드
2. 설치 후 MongoDB Compass (GUI 도구)도 함께 설치
3. 서비스에서 MongoDB 시작

### macOS
```bash
# Homebrew 사용
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Ubuntu/Debian
```bash
# 공식 저장소 추가 후 설치
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## 🔧 문제 해결

### 연결 오류 시
1. MongoDB 서비스가 실행 중인지 확인
2. 방화벽 설정 확인
3. `.env` 파일의 연결 문자열 확인
4. Atlas의 경우 IP 화이트리스트 확인

### 로그 확인
실행 시 다음과 같은 로그들을 확인할 수 있습니다:
- `🌐 MongoDB Atlas 연결을 사용합니다.`
- `🏠 로컬 MongoDB 연결을 사용합니다.`
- `✅ MongoDB 연결 성공!`
- `❌ MongoDB 연결 실패:`

## 📋 TODO
- [ ] 스키마 모델 확장
- [ ] API 엔드포인트 추가
- [ ] 사용자 인증 구현
- [ ] 테스트 코드 작성

## 📞 지원
문제가 발생하면 이슈를 등록해 주세요.
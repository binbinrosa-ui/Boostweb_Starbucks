# Starbucks Server

스타벅스 코리아 서버 API

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# MongoDB 연결 URL
MONGODB_URI=mongodb://localhost:27017/starbucks

# 서버 포트
PORT=3000

# JWT 시크릿 키 (실제 사용 시 강력한 랜덤 문자열로 변경하세요)
JWT_SECRET=your-secret-key-change-this-in-production

# 관리자 이메일 주소 (쉼표로 구분)
# 예: ADMIN_EMAILS=admin@starbucks.com,manager@starbucks.com
ADMIN_EMAILS=
```

**중요**: `.env` 파일은 Git에 커밋되지 않습니다. 실제 운영 환경에서는 강력한 JWT_SECRET을 사용하세요.

3. MongoDB 실행
- MongoDB가 설치되어 있어야 합니다.
- 로컬 MongoDB를 사용하거나 MongoDB Atlas를 사용할 수 있습니다.

4. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 인증 (Auth)

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
- **참고**: 사용자 유형(`user_type`)은 이메일 주소 기반으로 자동 결정됩니다. `.env` 파일의 `ADMIN_EMAILS`에 등록된 이메일은 자동으로 관리자로 설정됩니다.

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

## 데이터베이스 스키마

### User 모델

- `email` (String, 필수, 고유): 이메일 주소
- `name` (String, 필수): 이름
- `password` (String, 필수): 비밀번호 (해싱됨)
- `user_type` (String, 기본값: '고객'): 사용자 유형 ('고객', '관리자', '판매자') - 이메일 기반으로 자동 설정
- `address` (String, 선택): 주소
- `createdAt` (Date, 자동): 생성 날짜
- `updatedAt` (Date, 자동): 수정 날짜

## 보안

- 비밀번호는 bcrypt로 해싱됩니다.
- JWT 토큰을 사용한 인증을 지원합니다.
- 환경 변수에 민감한 정보를 저장하세요.


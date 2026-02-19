# 이미지 가져오기 가이드

## 📸 현재 이미지 사용 현황

메인 페이지(`index.html`)에서 사용 중인 이미지 위치:
- **캐러셀**: Unsplash 외부 URL 사용
- **갤러리**: Unsplash 외부 URL 사용
- **Blog 섹션**: Unsplash 외부 URL 사용

---

## 🎯 이미지 가져오는 방법

### 방법 1: 브라우저 개발자 도구로 직접 저장 (권장)

#### 단계별 가이드:

1. **스타벅스 코리아 홈페이지 접속**
   - https://www.starbucks.co.kr/index.do

2. **개발자 도구 열기**
   - `F12` 키 누르기
   - 또는 우클릭 → "검사" (Inspect)

3. **요소 검사 도구 사용**
   - 개발자 도구 상단의 요소 선택 아이콘 클릭 (또는 `Ctrl + Shift + C`)
   - 원하는 이미지에 마우스 오버 → 클릭

4. **이미지 URL 찾기**
   - Elements 탭에서 `<img>` 태그 또는 `background-image` 속성 찾기
   - `src="..."` 또는 `url(...)` 부분 복사

5. **이미지 다운로드**
   - 이미지 URL을 브라우저 주소창에 붙여넣기
   - 우클릭 → "이미지를 다른 이름으로 저장..."
   - `images/` 폴더에 저장

#### 예시:
```html
<!-- 개발자 도구에서 발견한 이미지 URL -->
<img src="https://image.istarbucks.co.kr/upload/common/img/main/2024/..." alt="...">

<!-- 다운로드 후 -->
<img src="images/starbucks-main-1.jpg" alt="...">
```

---

### 방법 2: Network 탭에서 이미지 찾기

1. **개발자 도구 열기** (`F12`)

2. **Network 탭 클릭**
   - 필터에서 "Img" 선택 (이미지만 표시)

3. **페이지 새로고침** (`F5`)

4. **이미지 목록 확인**
   - 원하는 이미지 클릭
   - Headers 탭에서 "Request URL" 복사
   - 또는 Preview 탭에서 우클릭 → "이미지를 다른 이름으로 저장..."

---

### 방법 3: 스타벅스 코리아 이미지 URL 직접 사용

**주의**: 외부 서버 이미지를 직접 사용하는 경우:
- ✅ 장점: 서버 용량 절약
- ❌ 단점: 외부 서버 문제 시 이미지 깨짐, 느린 로딩, URL 변경 가능

```html
<!-- 직접 URL 사용 예시 -->
<img src="https://image.istarbucks.co.kr/upload/common/img/main/2024/..." alt="...">
```

---

### 방법 4: 무료 스톡 이미지 사용

#### 추천 사이트:
- **Unsplash** (현재 사용 중): https://unsplash.com
  - 검색어: "coffee", "starbucks", "cafe"
- **Pexels**: https://www.pexels.com
- **Pixabay**: https://pixabay.com

#### 사용 예시:
```html
<!-- Unsplash에서 다운로드 후 -->
<img src="images/coffee-bg.jpg" alt="커피 배경">
```

---

## 📁 이미지 저장 위치

```
starbucks-homepage/
├── images/
│   ├── logo.png
│   ├── icon.png
│   ├── background/        (배경 이미지)
│   ├── gallery/           (갤러리 이미지)
│   └── misc/              (기타 이미지)
```

---

## 🔄 현재 코드에 적용하는 방법

### 예시 1: 캐러셀 이미지 교체

**현재 코드:**
```html
<div class="carousel-item active" style="background-image: url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3')">
```

**수정 후:**
```html
<div class="carousel-item active" style="background-image: url('images/background/starbucks-main-1.jpg')">
```

### 예시 2: 일반 이미지 교체

**현재 코드:**
```html
<img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&w=400" class="img-fluid" alt="...">
```

**수정 후:**
```html
<img src="images/gallery/starbucks-gallery-1.jpg" class="img-fluid" alt="...">
```

---

## ⚠️ 주의사항

### 저작권
- **스타벅스 공식 이미지**: 교육 목적으로만 사용 가능
- **상업적 사용 금지**: 실제 서비스 배포 시 라이선스 확인 필요
- **무료 스톡 이미지**: 라이선스 확인 후 사용

### 이미지 최적화
- **파일 크기**: 500KB 이하 권장
- **해상도**: 
  - 배경 이미지: 1920x1080px
  - 일반 이미지: 800x600px
  - 썸네일: 400x300px
- **포맷**: 
  - 사진: JPG
  - 로고/아이콘: PNG (투명 배경)
  - 간단한 그래픽: SVG

### 파일명 규칙
- 영문 소문자 사용
- 공백 대신 하이픈(-) 사용
- 의미 있는 이름 사용
- 예: `starbucks-main-carousel-1.jpg`, `menu-coffee-latte.jpg`

---

## 🛠️ 이미지 최적화 도구

### 온라인 도구:
- **TinyPNG**: https://tinypng.com (이미지 압축)
- **Squoosh**: https://squoosh.app (이미지 최적화)
- **Remove.bg**: https://www.remove.bg (배경 제거)

### 명령어 (ImageMagick 설치 시):
```bash
# 이미지 리사이즈
magick input.jpg -resize 1920x1080 output.jpg

# 이미지 압축
magick input.jpg -quality 85 output.jpg
```

---

## 📝 실전 예제

### 1단계: 스타벅스 홈페이지에서 이미지 찾기
1. https://www.starbucks.co.kr/index.do 접속
2. `F12` → Network 탭 → Img 필터
3. `F5` (새로고침)
4. 원하는 이미지 찾기

### 2단계: 이미지 다운로드
1. 이미지 우클릭 → "이미지를 다른 이름으로 저장..."
2. `starbucks-homepage/images/background/` 폴더에 저장
3. 파일명: `starbucks-main-1.jpg`

### 3단계: HTML 코드 수정
```html
<!-- 기존 -->
<div class="carousel-item active" style="background-image: url('https://images.unsplash.com/...')">

<!-- 수정 후 -->
<div class="carousel-item active" style="background-image: url('images/background/starbucks-main-1.jpg')">
```

### 4단계: 테스트
- 브라우저에서 `http://127.0.0.1:8000` 접속
- 이미지가 제대로 표시되는지 확인

---

## 💡 팁

1. **이미지 로딩 속도**: 로컬 이미지가 외부 URL보다 빠름
2. **오프라인 작업**: 로컬 이미지 사용 시 인터넷 불필요
3. **브라우저 캐싱**: 로컬 이미지는 캐싱 효율적
4. **백업**: 이미지 파일도 Git에 포함하거나 별도 백업

---

**작성일**: 2025-01-07  
**업데이트**: 스타벅스 코리아 홈페이지 이미지 가져오기 방법 추가


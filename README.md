# 🏓 K-Pickleball

미국 내 한인 피클볼 동호인 커뮤니티 사이트

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | ASP.NET Core 8 Web API |
| Database | PostgreSQL 16 (Supabase) |
| ORM | Entity Framework Core 8 + Npgsql |
| Auth | JWT Bearer + Google OAuth2 |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | Zustand + TanStack Query |
| Realtime | SignalR |
| Video | YouTube Data API v3 |
| Storage | Cloudflare R2 |
| Payment | Stripe |

---

## 프로젝트 구조

```
KPickleball/
├── src/
│   ├── KPickleball.API           # ASP.NET Core Web API
│   ├── KPickleball.Application   # CQRS, DTOs, Interfaces
│   ├── KPickleball.Domain        # Entities, Enums
│   └── KPickleball.Infrastructure # EF Core, Services
├── tests/
│   └── KPickleball.Tests
├── frontend/                      # React + TypeScript
└── KPickleball.sln
```

---

## 시작하기

### 1. PostgreSQL 실행 (Docker)
```bash
docker run -d \
  --name kpickleball-db \
  -e POSTGRES_DB=kpickleball \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:16
```

### 2. 백엔드 실행
```bash
cd src/KPickleball.API

# appsettings.json 에서 DB 연결 문자열 확인 후:
dotnet ef database update
dotnet run
# → http://localhost:5000
# → Swagger: http://localhost:5000/swagger
```

### 3. 프론트엔드 실행
```bash
cd frontend
cp .env.example .env
# .env에 Google Client ID 입력 후:
npm install
npm run dev
# → http://localhost:5173
```

---

## 환경 변수 설정

### Backend (appsettings.json)
| 키 | 설명 |
|----|------|
| `Jwt:Secret` | 최소 32자 이상의 임의 문자열 |
| `Google:ClientId` | Google Cloud Console에서 발급 |
| `Stripe:SecretKey` | Stripe Dashboard에서 발급 |
| `Cloudflare:R2*` | Cloudflare R2 버킷 설정 |

### Frontend (.env)
| 키 | 설명 |
|----|------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |

---

## EF Core Migration 명령어
```bash
cd src/KPickleball.API

# 마이그레이션 생성
dotnet ef migrations add InitialCreate --project ../KPickleball.Infrastructure

# DB 적용
dotnet ef database update

# 마이그레이션 되돌리기
dotnet ef database update 0
```

---

## API 엔드포인트 (주요)

| Method | URL | 설명 | Auth |
|--------|-----|------|------|
| POST | /api/auth/register | 회원가입 | - |
| POST | /api/auth/login | 로그인 | - |
| POST | /api/auth/google | Google 로그인 | - |
| POST | /api/auth/refresh | 토큰 갱신 | - |
| GET | /api/posts | 게시글 목록 | - |
| POST | /api/posts | 게시글 작성 | ✅ |
| GET | /api/videos | 동영상 목록 | - |
| POST | /api/videos | 동영상 등록 | ✅ |
| GET | /api/clubs | 클럽 목록 | - |
| POST | /api/clubs | 클럽 생성 | ✅ |
| GET | /api/tournaments | 대회 목록 | - |
| GET | /api/courts | 코트 목록 | - |

전체 API 문서: http://localhost:5000/swagger

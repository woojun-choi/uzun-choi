# Works 콘텐츠 스키마

작업물 하나 = 폴더 하나. `_template`을 복사해서 새 작업 폴더를 만든다.

```
content/works/<slug>/
  meta.json         # 작업명, 연도, 분류, 대표이미지, 정렬순서
  content.ko.md      # 작업 설명 (한글, 마크다운 본문)
  content.en.md      # 작업 설명 (영문, 마크다운 본문)
  media/              # 이미지 / gif / 영상 (여러 개, 번호 prefix 권장: 01_, 02_ ...)
```

## slug (폴더명)
kebab-case. 정렬 편의를 위해 연도 prefix 권장: `2026-nightscape-portrait`

## meta.json 필드
| 필드 | 타입 | 설명 |
|---|---|---|
| `slug` | string | 폴더명과 동일하게 유지 |
| `title.ko` / `title.en` | string | 작업명 (한/영) |
| `year` | number | 작업 연도 |
| `category` | string[] | `photo` \| `film` \| `design` \| `editorial` \| `dev` 중 1~2개 |
| `cover` | string | Works 그리드 대표 썸네일 경로 (`media/` 기준 상대경로) |
| `heroCover` | string | 홈 히어로 캐러셀 전용 대표 이미지 경로 (옵션, 없으면 `cover` 사용) |
| `order` | number | Works 그리드 정렬 우선순위 (낮을수록 먼저, 옵션) |
| `credit` | `{role, name}[]` | 상세페이지 CREDIT 섹션 (예: `{"role": "All by", "name": "UZUN CHOI"}`, 옵션, 비어있으면 섹션 자체 숨김) |
| `videoUrl` | string | 실제 영상 링크(유튜브 등). 있으면 상세페이지 하단 스택 이미지 다음에 유튜브 임베드 표시 (옵션) |
| `heroMedia` | string[] | 상세페이지 상단 히어로 캐러셀에 노출할 이미지 목록 (`media/` 기준 상대경로, 순서대로). 옵션 — 없으면 `media/`의 전체 이미지를 순서대로 사용 |
| `stackedMedia` | string[] | 상세페이지 하단 스택 섹션에 고정으로 노출할 이미지 목록 (`media/` 기준 상대경로, 순서대로). 옵션 — 없으면 이미지가 8장 넘을 때 슬러그 기반 고정 랜덤으로 최대 7장을 골라 보여줌 |
| `heroPortrait` | boolean | 히어로 이미지를 세로 사진처럼 처리(크롭 없는 `object-contain`)할지 강제 지정. 옵션 — 없으면 실제 이미지 가로/세로 비율로 자동 판별(정사각형 등 애매한 비율을 세로처럼 보이고 싶을 때 사용) |

## media/
파일명에 번호를 붙여 노출 순서를 명시한다 (`01_cover.jpg`, `02_detail.gif`, `03_process.mp4`).
지금은 레포에 직접 저장. 용량 문제가 생기면 외부 스토리지(Vercel Blob 등)로 옮기고 `meta.json`/`cover` 경로만 URL로 교체하면 되도록 구조를 맞춰둔 것.

## 새 작업 추가 방법
1. `content/works/_template` 폴더를 복사해 `content/works/<새-slug>` 로 이름 변경
2. `meta.json`의 `slug`, `title`, `year`, `category`, `cover`, `order` 채우기
3. `content.ko.md` / `content.en.md`에 설명 작성
4. `media/`에 파일 넣고 `meta.json`의 `cover` 경로 확인

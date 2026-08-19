# uzun-choi 인수인계 로그

## 2026-08-20 01:03 — dummy work 20개를 실제 작업 27개로 전면 교체, 커버/설명 전부 채움

**지금 상태**: 사용자가 `content/works/input_contents/`에 넣어둔 27개 실작업 폴더(2024~2026, 사진/영상/디자인)를 `content/works/<slug>/` 스키마로 재구성 완료. dummy-01~20 삭제, 기존 중복 항목 `sanjeong`은 `2026-14-jeju`로 통합 후 삭제. 27개 전부 사용자와 1개씩 확인하며 커버 이미지 확정 + `content.ko.md`/`content.en.md` 실제 설명 작성 완료(placeholder 없음, `grep`으로 검증함). `book` 카테고리는 `editorial`로 개명하고 DEV 앞으로 순서 이동(`lib/works.ts`, `WorksGrid.tsx`, README 반영). 홈 히어로/Works 그리드 커버를 분리하는 `heroCover` 필드를 `WorkMeta`에 신규 추가(`workHeroCoverUrl`), iPhone obscura 작업에 적용. 격리 dev 서버(포트 3200, uzun-choi 자체 dev 서버는 미실행 상태였음)로 그리드 27장 전체 로드·EDITORIAL 필터 확인 완료. **아직 아무것도 git commit 안 함** — `git status` 118개 변경 대기 중.

**남은 일**: (1) 커밋 여부/범위를 사용자와 확정할 것 — `content/works/input_contents/`(~1.1GB, `.gitignore` 처리됨, 커밋 안 됨)는 로컬 백업용으로 남겨두기로 함. (2) `/works/[slug]` 상세 페이지 제작 — 미착수. (3) 최종 QA(반응형, 접근성, Lighthouse)와 배포 — 미착수.

**하면 안 되는 일**: `content/works/input_contents/`를 지우지 말 것(사용자가 원본 백업으로 보관하기로 명시적으로 결정함, `.gitignore`에 이미 등록됨). 커버 이미지는 절대 임의로 재선정하지 말 것 — 매 작업마다 사용자가 직접 후보를 보고 골랐음(1번 작업만 예외로 자동 반영 승인). `content.en.md`는 절대 한국어 요약을 그대로 복붙하지 말고 실제 영어로 번역해서 쓸 것. HWP 원본 신청서(`2026-14-jeju` 소스 폴더)에서 텍스트 뽑을 때 개인정보(주소/연락처/생년월일) 항목은 절대 콘텐츠에 넣지 말 것 — 이번에 의도적으로 제외함.

**검증 방법**: `npx next build && npx next start -p 3200`(next.config.ts에 `distDir: ".next-verify"` 임시 추가 → 끝나면 원복 + `.next-verify` 삭제 + 포트 프로세스 pkill, HANDOFF 이전 기록의 절차 그대로). `http://localhost:3200/works`에서 27개 타일 전부 이미지 로드되는지, EDITORIAL 탭 필터링(Magazine A - UZUN만 남는지) 확인. `git status --porcelain=v1 content/works` 로 dummy-* 삭제 + 27개 신규 폴더 반영됐는지 확인.

**참고**: `lib/works.ts`(WorkCategory에 editorial 추가, heroCover 필드/workHeroCoverUrl 함수), `components/WorksGrid.tsx`(TAGS 순서), `app/page.tsx`(workHeroCoverUrl 사용), `content/works/README.md`(스키마 문서 갱신). 27개 작업 slug 목록은 `content/works/*/meta.json`의 `order` 필드(1=최신 uzun-BI ~ 27=가장 오래된 기원)로 확인 가능.

## 2026-08-18 03:00 — Header/MenuOverlay/WorksGrid/About 스타일 다듬기 마무리, 다음 단계 대기 중

**지금 상태**: About 페이지(히어로/CV/카테고리/컨택 섹션 간격, Figma 재동기화 반영), Header(로고→홈 링크, 배경 그라데이션 제거, 로고 위 여백 축소), WorksGrid(호버 시 94% 축소 + 좌하단 작품명/우상단 연도 오버레이), MenuOverlay(EN/KR 토글 제거, 메뉴 간격/카피라이트 등 세부 조정) 전부 완료되어 커밋 4개(`0cc9f2c`, `17f3c33`, `6b7511b`, `7b413bb`)로 나눠 push 완료. 작업 트리는 CLAUDE.md 수정(HANDOFF 안내 추가) 외엔 clean.

**남은 일**: (1) `content/works/dummy-01~20`을 실제 작품 콘텐츠로 교체 — 사용자가 아직 자료 미제공, 다음 세션에서 먼저 물어볼 것. (2) `/works/[slug]` 상세 페이지 제작 — 사용자가 "아직 준비 안됐다"며 보류함. (3) 최종 QA(반응형 vw 스케일링, 접근성, Lighthouse)와 www.uzun-choi.com 배포 — 미착수. 직전 브리핑에서 사용자에게 "지금 자료 줄지, 상세페이지부터 볼지" 물어봤고 아직 답 없음.

**하면 안 되는 일**: 사용자의 실제 `next dev`(포트 3000)를 절대 건드리지 말 것 — Next 16은 같은 디렉토리에서 `next dev` 2개 동시 실행을 막음(distDir 달라도 락 걸림). 검증은 항상 `next build` + `next start -p 3200`(격리된 `.next-verify` distDir)로만 하고 끝나면 `next.config.ts` 원복 + `.next-verify` 삭제 + 포트 프로세스 pkill. 짧은 지시("10px 줄여줘", "조금만")는 직전 명시값 기준 상대 조정으로 해석할 것. Figma 값은 항상 1920px 기준 px/1920*100 공식으로 vw 환산(1px 헤어라인만 리터럴 유지).

**검증 방법**: `npx next build && npx next start -p 3200` 후 브라우저로 확인(위 방식대로 격리 실행). 커밋 히스토리는 `git log --oneline -5`로 확인 가능 — 위 4개 커밋이 최신이어야 정상.

**참고**: `components/AboutSection.tsx`, `components/Header.tsx`, `components/MenuOverlay.tsx`, `components/WorksGrid.tsx`가 이번 세션 주요 변경 파일. Figma 파일명은 "UC WEB" (Dev Mode MCP로 조회). `components/WorksGrid.tsx`와 `components/MenuOverlay.tsx`에 남아있는 `pt-[9.89583vw]`는 옛 헤더 높이(190px) 기준 값 그대로 방치됨(현재 헤더는 170px) — 시각적으로 문제없어 보여서 그대로 뒀음, 필요시 `pt-[8.85417vw]`로 맞출 것.

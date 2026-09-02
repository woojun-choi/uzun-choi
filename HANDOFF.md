# uzun-choi 인수인계 로그

## 2026-09-02 11:48 — 데스크톱 메뉴 Safari 정렬 수정, Works 그리드 썸네일 최적화, 커밋·푸시 완료

**지금 상태**: 두 커밋으로 나눠 커밋·푸시 완료(`1871b39`, `1a819ae`), `git status` clean, `origin/main` 동기화됨.
1. `MenuOverlay.tsx`: 데스크톱 메뉴 하단 태그 줄("Photography | Film | Design | Dev")이 Safari에서 가운데 정렬처럼 보이는 문제 — 기존엔 부모의 `items-end`(고정폭 컨테이너 안에서 콘텐츠가 폭에 거의 딱 맞거나 살짝 넘치는 상태)에만 의존했는데, 엔진마다 오버플로우 처리가 갈릴 수 있어서 각 줄 자체에 `w-full justify-end`를 추가해 `justify-content`로 직접 우측 고정하도록 바꿈. Chrome에서는 재확인 완료, **Safari 재확인은 사용자 몫**(요청받았으나 이 세션에서 직접 Safari로 검증은 못 함 — Claude in Chrome은 Chrome만 자동화 가능).
2. 모바일 하단 태그 블록 전체를 15% 축소해달라는 요청 → 적용 직후 사용자가 "축소하기 전으로 되돌려줘"라고 해서 즉시 원복함. **결과적으로 이 부분은 순변경 없음**(커밋에도 안 들어감).
3. Works 그리드(`/works`, 데스크톱) 썸네일 로딩이 느리다는 요청 → 원인 분석 후 개선: 그리드가 `meta.json`의 `cover` 원본(평균 5.2MB, 최대 70MB/9050×6000px)을 그대로 Next Image Optimizer에 흘려보내고 있었음. `scripts/generate-thumbnails.mjs`(macOS `sips` 사용, 새 npm 의존성 없음) 작성해서 각 작업 커버를 짧은 변 720px(데스크톱 그리드 카드 짧은 변 284px의 2.5배, 사용자가 배율 확정) 기준으로 리사이즈해 `content/works/<slug>/media/thumb/`에 저장, 27개 작업 전부 1회 생성 완료. `lib/works.ts`에 `workCoverThumbUrl()` 추가(썸네일 있으면 사용, 없으면 원본 fallback), `app/works/page.tsx`가 이걸 쓰도록 교체. 그리드가 실제로 받는 커버 총량 173.2MB → 5.84MB(~30배 감소). Chrome으로 `/works` 데스크탑 폭 확인, 전부 정상 렌더링·화질 이상 없음.
4. 로컬 dev 서버를 3000 → **3100번 포트로 이전**(`npm run dev -- -p 3100`, 백그라운드 실행 중, 로그 `/tmp/next-dev-3100.log`). 3000번은 종료됨.

**남은 일**: (1) 사용자가 실제 Safari에서 메뉴 정렬 재확인 필요 — 여전히 문제면 스크린샷 요청할 것. (2) `WorksGrid.tsx`의 `FULL_SIZE_THUMBNAIL_SLUGS`(7개 작업, `sizes` prop 생략해서 필요 이상 큰 이미지를 받아옴) — 이제 원본 자체가 작아졌으니 이 예외가 불필요해졌을 가능성 큼, 사용자에게 정리 제안했으나 아직 답 없음. (3) `content/works/*/meta.json`의 `cover`가 바뀌면 `node scripts/generate-thumbnails.mjs`를 다시 돌려야 썸네일이 갱신됨(이미 있는 파일은 건너뜀) — 콘텐츠 추가 워크플로우 문서(`content/works/README.md`)에 아직 반영 안 함.

**하면 안 되는 일**: Chrome 자동화 `resize_window`를 같은 탭에 반복 호출해서 좁혔다 넓혔다 하지 말 것 — 이미 넓어진 창을 다시 좁히는 것도, 좁은 채로 새 탭을 열어 넓히는 것도 잘 안 먹힐 때가 있음. 탭을 닫고 `tabs_context_mcp`로 새로 연 직후 바로 `resize_window` → `navigate` 순서로 하면 안정적으로 먹힘(`window.innerWidth`로 실제 반영됐는지 재확인할 것). `scripts/generate-thumbnails.mjs`는 짧은 변 기준으로만 리사이즈하고 크롭은 안 함(크롭은 `object-cover`에 위임) — 정확한 W×H로 크롭하는 방식으로 바꾸지 말 것, `object-cover`가 자르는 영역과 어긋날 수 있음.

**검증 방법**: `git log --oneline -3`에 `1a819ae`가 최신, `git status` clean, `origin/main`과 동기화 확인. `http://localhost:3100/works`에서 데스크톱 폭(1440px 이상)으로 그리드 썸네일이 선명하게 뜨는지, 네트워크 탭에서 각 썸네일 요청이 수백 KB대인지(원본 MB대가 아닌지) 확인. 데스크톱 메뉴(`/` → 우측 상단 햄버거)에서 하단 태그 줄이 "ALWAYS, REFINE, STILL"·카피라이트와 같은 우측 라인에 맞는지 Chrome에서 먼저 확인 후, 실제 Safari에서도 확인.

**참고**: 커밋 `1871b39`(메뉴 정렬+About/상세 폰트 최종본), `1a819ae`(썸네일 최적화). `lib/works.ts`의 `workCoverThumbUrl`/`toThumbRelPath`, `scripts/generate-thumbnails.mjs`(`TARGET_MIN_SIDE = 720`), `WorksGrid.tsx`의 `FULL_SIZE_THUMBNAIL_SLUGS`. dev 서버는 현재 3100번 포트에서 실행 중(3000 아님).

## 2026-09-02 10:00 — About/상세 모바일 타이포·간격 대규모 조정, 메뉴 정렬 버그 수정(미커밋)

**지금 상태**: 이전 세션(2026-08-31, 커밋 `8314a77`~`912bd7d`)에서 시작한 모바일 전용 폴리시 작업을 이어서 진행. 이번 세션에서 한 일:
1. Works 그리드 썸네일 리사이징(`sizes` prop) 제외 목록에 `2026-14-jeju` 추가(커밋 `f49ac04`에 포함된 기존 5개+오늘 1개).
2. Magazine A - UZUN(`2026-11-magazine-a-uzun`)의 상세페이지 "스택" 이미지: `69`번 이미지를 최상단 고정, `12`~`67`번(56장) 중 9장을 매 새로고침마다 진짜 랜덤(Math.random, seed 없음)으로 뽑되 번호 오름차순으로 정렬해서 노출. `2026-12-0000`/`2026-15-10-pure-freestyle`도 같은 방식(고정 없이 전체 미디어 풀에서 7장 랜덤)으로 확장. `lib/works.ts`에 `stackedPinned`/`stackedRandomPool`/`stackedRandomCount` 필드 추가, `WorkDetail.tsx`에 `pickRandomInOrder()` 구현(SSR 하이드레이션 안전하게 초기값은 결정적, `useEffect`에서 진짜 랜덤 재계산). (이상 커밋 `f49ac04`)
3. 상세페이지 타이틀이 2줄로 줄바꿈되는지 `useRef`+`scrollHeight` 비교로 자동 감지해서, 2줄일 때만 모바일에서 5px 아래로 `translate-y` — 실제 줄바꿈 여부 기반이라 새 작업 추가돼도 자동 대응됨. (커밋 `f49ac04`)
4. About/상세 폰트 크기·행간·구분선 위아래 여백을 여러 차례 미세조정 끝에 최종 확정, 그 다음 About "이름~이메일 링크"·상세 "Description 라벨~Credit 본문"을 각각 +2px, 다시 +1px 추가 인상(비율 유지하며 관련 leading도 재계산). 소개/Description 본문 영문·한글 행간, CV 항목 제목 행간, 이메일-인스타 아이콘 간격(+5px), 인스타 아이콘 크기(+1px)도 조정. (커밋 `912bd7d`, 그리고 **아직 미커밋 상태로 +1px 라운드 존재** — 아래 참고)
5. `MenuOverlay.tsx`: 데스크톱 메뉴 오버레이 하단 태그 목록("Photography | Film | Design | Dev")이 다른 줄(About/Works/Contact, "ALWAYS, REFINE, STILL", 카피라이트)과 우측 정렬이 안 맞던 버그 발견·수정 — 태그 컨테이너에 붙어있던 불필요한 `px-[0.84203vw] md:px-[0.20833vw]` 패딩 제거. **미커밋**.

**남은 일**: `git status`에 잡히는 `components/AboutSection.tsx`, `components/WorkDetail.tsx`(4번 항목 마지막 +1px 라운드), `components/MenuOverlay.tsx`(5번 메뉴 정렬 수정) 전부 미커밋 상태. 사용자에게 커밋·푸시 확인만 받으면 됨(직전에 물어봤고 아직 답 대기 중이었음).

**하면 안 되는 일**: (이 프로젝트 공용 규칙, 메모리에도 저장됨) 모바일 전용 값을 건드릴 때 그 클래스에 `md:` 오버라이드가 없으면 반드시 먼저 현재 데스크톱 계산값으로 `md:` 값을 고정해서 추가한 뒤에 모바일(unprefixed) 값을 바꿀 것 — 안 그러면 `vw` 단위 특성상 데스크톱까지 같이 변함(이번 세션엔 이 규칙을 계속 지켜서 문제 없었음). 폰트 크기를 부모→자식으로 옮길 때 자식에 `md:text-[...]`를 안 붙이면 데스크톱에서 글자가 뷰포트 기준으로 커져서 겹치는 심각한 버그 발생(직전 세션에 실제로 겪고 고침, `WorkDetail.tsx` Description 섹션). Chrome 자동화의 `resize_window`는 이미 넓어진 창을 다시 좁히는 게 잘 안 먹힘 — 탭을 닫고 `tabs_context_mcp`로 새로 연 뒤 resize해야 안정적으로 먹힘.

**검증 방법**: `git diff --stat`로 위 3개 파일 확인 후 커밋. 데스크톱 메뉴 정렬은 `http://localhost:3000/` 접속 → 우측 상단 햄버거 클릭 → 하단 "Photography | Film | Design | Dev"의 "Dev" 우측 끝이 "ALWAYS, REFINE, STILL"·카피라이트 우측 끝과 정확히 일치하는지 확인(1154px 폭에서 DOM 좌표로 실측 완료: 전부 1102.914px로 일치). About(`/about`)·상세(`/works/<slug>`) 폰트/행간은 모바일(390px 폭)에서 가로 스크롤 없는지, 카테고리 2x2 그리드 안 깨지는지 확인.

**참고**: 커밋 `f49ac04`(스택 랜덤·2줄 타이틀·리사이징), `912bd7d`(+2px 폰트 라운드) — 오늘 세션은 그 위에 이어서 작업. `lib/works.ts`의 `stackedPinned`/`stackedRandomPool`/`stackedRandomCount`, `WorkDetail.tsx`의 `pickRandomInOrder`/`titleWraps` 로직, `MenuOverlay.tsx`의 `WORK_TAGS` 렌더 부분. 프로젝트 메모리 파일 `feedback_mobile_only_edits.md`에 모바일 전용 편집 규칙 정리돼 있음.

## 2026-08-30 13:53 — 메인 히어로 모바일/데스크톱 분리 큐레이션, 커밋·푸시 완료

**지금 상태**: 직전 세션(13:31 항목)에서 모바일 반응형 빌드를 끝낸 뒤, 같은 세션에서 이어서 메인(`/`) 히어로 슬라이드를 모바일과 데스크톱이 서로 다른 작업 목록/순서를 갖도록 분리함. 커밋 `89eeda6`로 13개 파일 커밋·푸시 완료, `origin/main` 동기화됨.
1. `lib/works.ts`의 `WorkMeta`에 `featuredMobile?: boolean`, `mobileOrder?: number` 필드 추가하고 `getFeaturedMobileWorks()`(featuredMobile로 필터, mobileOrder로 정렬) 신설. 기존 `featured`/`getFeaturedWorks()`(데스크톱용, order 필드로 정렬)는 그대로 유지.
2. `components/HeroSection.tsx`: 기존 캐러셀 로직 전체를 내부 `Carousel({ items })` 컴포넌트로 추출하고, `HeroSection`은 `md:hidden`/`hidden md:block`으로 감싼 `Carousel` 두 개를 렌더링(모바일용 `mobileItems`, 데스크톱용 `items`를 각각 받음) — 두 캐러셀이 항상 동시에 DOM에 존재하고 CSS로만 전환되는 방식(ContactSection 등 기존 관례와 동일).
3. `app/page.tsx`: `getFeaturedWorks()`(데스크톱, 기존 10개 유지)와 `getFeaturedMobileWorks()`(모바일 신규)를 각각 `buildSlides()`로 변환해 `HeroSection`에 전달.
4. 모바일 히어로 최종 목록(10개, `mobileOrder` 순): UZUN BI(2026-16) → Jeju(2026-14) → Derrick Kakooza(2026-08) → Movie Land(2026-09) → 변정훈(2026-07) → Bombshelluth(2026-06) → E-OL(2026-05) → BAZAAR Cover(2025-04) → Mosaic(2024-05) → 불나방(2024-04). ("Magazine A - Movie Land"는 사용자가 한 번 추가했다가 바로 빼달라고 해서 최종 목록엔 없음 — `2026-13-magazine-a-movie-land/meta.json`은 원래 상태로 복귀.)
5. 모바일 히어로 타이틀이 2줄로 줄바꿈될 때(예: "Derrick Kakooza") 우측 정렬이라 어색해 보이는 문제 — `items-end`/`text-right` → `items-start`/`text-left`로 전환(데스크톱은 원래도 좌측 정렬이라 영향 없음).
6. **사이드 이슈(해결됨)**: 11개 `meta.json`에 필드를 추가할 때 python `json.dump(indent=2)`를 써서, 기존에 한 줄로 압축돼 있던 `credit` 배열(`{ "role": "...", "name": "..." }`)이 전부 여러 줄로 재포맷되는 부작용이 있었음 — 커밋 전에 발견해서 6개 파일(bulnabang/bazaar-cover/eol/byeonjeonghun/derick/magazine-a-movie-land) 전부 원래 압축 포맷으로 직접 되돌린 뒤 커밋함(최종 diff는 파일당 +4/-1로 깨끗함).

**남은 일**: 없음. 사용자가 요청한 모바일 히어로 분리·순서·정렬 전부 반영·커밋·푸시 완료.

**하면 안 되는 일**: 앞으로 `content/works/*/meta.json`을 스크립트로 일괄 수정할 때 `json.dump(indent=2)`를 그대로 쓰지 말 것 — 기존 파일들의 `credit` 배열은 사람이 손으로 압축 포맷(`{ "role": "X", "name": "Y" }` 한 줄)을 유지해왔는데, 표준 `json.dump`는 이걸 강제로 여러 줄로 펼쳐버려서 불필요한 diff 노이즈를 만듦. 필드 추가가 필요하면 텍스트 치환(Edit) 방식이나, 최소한 커밋 전에 `git diff`로 의도치 않은 재포맷이 없는지 반드시 확인할 것.

**검증 방법**: `git log --oneline -3`에 `89eeda6`가 최신, `git status`가 clean인지 확인. `http://localhost:3000/`에서 모바일 폭(390×844)일 때 위 10개 순서대로 슬라이드가 넘어가는지, `md:` 이상 폭에서는 기존 데스크톱 10개(UZUN BI/Jeju/Movie Land/Bombshelluth/E-OL/JBL GO 4/iPhone obscura/Waffle/홍연/Mosaic)가 그대로 나오는지 확인. "Derrick Kakooza"처럼 2줄 넘어가는 타이틀이 왼쪽 정렬로 나오는지도 확인.

**참고**: `lib/works.ts`(`getFeaturedMobileWorks`), `app/page.tsx`, `components/HeroSection.tsx`(`Carousel` 분리), 커밋 `89eeda6`. 데스크톱 featured 10개와 모바일 featured 10개는 서로 겹치는 작업도 있고(UZUN BI/Jeju/Movie Land/Bombshelluth/E-OL/Mosaic) 안 겹치는 작업도 있음(모바일만: Derrick Kakooza/변정훈/BAZAAR Cover/불나방, 데스크톱만: JBL GO 4/iPhone obscura/Waffle/홍연) — 둘 다 독립적인 필드(`featured` vs `featuredMobile`)라 한쪽만 바꿔도 다른 쪽엔 영향 없음.

## 2026-08-30 13:31 — 전체 페이지 모바일(390px) 반응형 빌드 완료, 커밋·푸시 완료

**지금 상태**: 데스크톱(1920 기준) 전용이던 사이트에 모바일 breakpoint를 전 페이지에 걸쳐 추가함. 커밋 `898b3d8`로 12개 파일(컴포넌트 11개 + `lib/useSwipe.ts` 신규) 한 번에 커밋·푸시 완료, `origin/main`과 동기화됨. 패턴: unprefixed 클래스 = 모바일(390 baseline), `md:` = 데스크톱(1920 baseline, 기존 값 그대로).
1. **전역 헤더/메뉴**(`Header.tsx`, `MenuToggle.tsx`, `MenuOverlay.tsx`): 모바일 크기값 추가, 햄버거→X 애니메이션을 퍼센트 기반 중앙정렬로 재구현, 메뉴 하단 인스타/태그/카피라이트 블록 크기·간격 조정.
2. **Hero/Main**(`HeroSection.tsx`) + 신규 `lib/useSwipe.ts`: 세로 스와이프로 슬라이드 전환, 타이틀 `priority` 버그 수정(래핑 클론이 아닌 실제 첫 슬라이드에 우선순위 부여), 모바일에서 연도 숨김.
3. **About**(`AboutSection.tsx`): 데스크톱 2단(라벨+콘텐츠) → 모바일 세로 스택, 프로필 사진 크롭 비율 별도 지정, 카테고리 4열 그리드는 유지.
4. **Contact**(`ContactSection.tsx`): 데스크톱 마우스추적 인터랙션은 `md:flex`로 격리, 모바일은 이메일 탭 시 안내문구 3.5초간 노출 후 자동 숨김(`CopyEmailLink.tsx`에 `onClick` prop 추가).
5. **Works 그리드**(`WorksGrid.tsx`): 태그 필터를 풀스크린폭 슬라이드 캐러셀로 구현 — 처음엔 CSS `scroll-snap`으로 만들었다가 (a) 컨테이너 `padding-left`가 snap 스크롤에 의해 초기 로드시 스크롤되어 숨어버리는 버그, (b) 스와이프 히트 영역이 텍스트 한 줄 높이라 너무 얇아 실기기에서 안 먹히는 문제 때문에 `useSwipe` + index state + `transform: translateX` 방식으로 전환. 태그 좌측 정렬을 그리드 좌측 여백과 일치시킴. 카드 호버 오버레이(연도/타이틀)는 `md:` 전용으로 격리(모바일 탭 시 안 뜨게).
6. **작업 상세**(`WorkDetail.tsx`, `ScrollNav.tsx`): 히어로 캐러셀 스와이프 연결, 모바일 카피라이트 복원(이전 세션에 제거했던 것 Figma 대조 중 재확인 후 복원), 모바일 상하 스크롤 버튼을 데스크톱과 동일하게 박스 테두리 있는 형태로 복원(아이콘/박스 비율도 50%로 데스크톱과 일치시킴), 긴 타이틀 2줄바꿈 시 우측 인덱스와 겹치던 버그 수정(`max-w` 제한), ScrollNav를 헤더 햄버거와 같은 우측 라인(30px 마진)에 정렬, 타이틀 행간 1.15배로 키우고 ScrollNav와 타이틀 박스 하단을 실측 정렬, Description/Credit 폰트 10px·행간 EN 15px/KO 16px로 조정.

**남은 일**: 없음 — 사용자가 명시적으로 요청한 항목은 모두 처리·커밋·푸시 완료. 다음 세션은 사용자의 새 요청을 기다리면 됨.

**하면 안 되는 일**: `ScrollNav.tsx`의 모바일 위/아래 버튼을 다시 숨기지 말 것(`hidden md:flex`로 되돌리지 말 것) — 이번 세션에 사용자가 명시적으로 "다시 만들어달라"고 요청해서 복원함. `WorkDetail.tsx`의 타이틀 컨테이너 `max-w-[65vw]`/`text-right`, `ScrollNav`의 `right-[4.05897vw]`/`top-[145.09151vw]`는 서로 실측값으로 맞물려 있으므로 하나만 단독으로 바꾸면(예: ScrollNav 위치만 옮기기) 타이틀과 다시 겹치거나 하단 정렬이 깨짐 — 셋 중 하나를 바꾸면 나머지도 같이 재계산해야 함. Works 그리드 태그 스와이프를 다시 CSS `scroll-snap` 방식으로 되돌리지 말 것(패딩 버그+얇은 히트영역 문제로 이미 폐기됨).

**검증 방법**: `git log --oneline -3`에 `898b3d8`가 최신, `git status`가 clean인지 확인. Chrome 개발자도구 디바이스 툴바(390×844) 또는 실제 폰으로 `/`, `/about`, `/contact`, `/works`, `/works/<slug>` 전부 확인 — 특히 `/works`에서 태그 스와이프, `/works/<slug>`에서 히어로 스와이프+상하 버튼+타이틀/ScrollNav 정렬, `/contact`에서 이메일 탭 후 안내문 노출→3.5초 후 사라짐 확인.

**참고**: Figma Dev Mode MCP 노드 매핑 — M 1. Main(741:263), M 1-2. Main/menu(741:283), M 2. About(741:420), M 3. Works(741:520), M 4. Details(741:570), M 5. Contact(741:620). Figma와의 의도적 불일치 2건(사용자 확정): 모바일에서 타이틀 옆 연도 숨김(Figma는 보임), Works 그리드 페이지 자체엔 카피라이트 없음(작업 상세 페이지엔 있음). 커밋 `898b3d8`.

## 2026-08-28 21:20 — 27개 작업 전체 순회(크레딧/설명/히어로 정리) 완료, 커밋·푸시 완료

**지금 상태**: 지난 세션에서 시작한 "1번부터 27번까지 작업 순서대로 크레딧이랑 상세페이지 수정" 작업을 이번 세션에서 끝까지 완료함. 두 커밋으로 나눠 커밋·푸시까지 마침(`bef77f1` 코드/스키마, `47119f0` 27개 작업 콘텐츠 편집) — `git status`/`origin/main` 완전히 동기화된 상태.
1. **코드/스키마 신규 기능**(`components/WorkDetail.tsx`, `lib/works.ts`): `WorkMeta`에 `heroPortrait`(정사각/애매한 비율 이미지를 세로처럼 강제 `object-contain` 처리), `heroMedia`/`stackedMedia`(히어로·스택 섹션에 보여줄 이미지를 명시적으로 지정, 없으면 기존 동작 — 전체/슬러그 시드 랜덤 7장 — 유지) 추가. Description/Credit 텍스트에 weight+opacity 위계(라벨은 굵게, 본문/값은 `font-[550] text-white/80`) 적용, 문단 줄바꿈 실제 렌더링되도록 수정(`\n{2,}` split), 언어별 행간 별도 조정(영문 1.85vw/한글 1.95vw). **Esc 키**: 라이트박스 열려있으면 닫기, 아니면 헤더 X와 동일하게 `/works`로 이동(`useRouter` + `keydown` 리스너).
2. **27개 작업 전체 편집**: 각 작업 순회하며 (a) 설명 문장 다듬기/불필요한 "전 과정을 직접 진행했다"류 문장 정리, (b) 협업 작업엔 크레딧 추가(`Photo by`/`Model`/`Artist`/`Artwork by`/`Special Thanks to`, "by"는 항상 소문자), 순수 개인 작업은 크레딧 생략, (c) 정사각/특이 비율 커버(In your eyes, 불나방, 구석 등)에 `heroPortrait: true`, (d) 매거진류(Magazine A - Movie Land, Magazine A - UZUN)에 `heroMedia`/`stackedMedia`로 히어로엔 촬영컷만, 스택엔 특정 내지 스캔만 고정 노출, (e) iPhone obscura는 히어로 14,15,12,11,13 순서 + 스택 1~10번 전부. Nukumori의 안 쓰는 2번째 이미지(포스터)는 파일째 삭제.
3. **디자인 사이드 트랙**: `RollingNumber.tsx`(ScrollNav 페이지네이션 숫자)의 "두자릿수 정렬이 이상해 보인다" 이슈 — devtools로 픽셀 단위까지 정밀 측정해서 실제 레이아웃은 완벽히 동일함을 확인, 폰트 자체의 숫자 글리프 모양 차이(정상)로 결론. `tabular-nums`를 시도했다가 사용자가 "애매하다"며 되돌려달라고 해서 원상복구함 — 현재 `RollingNumber.tsx`는 이 세션 이전 상태 그대로.

**남은 일**: 대화 중 사용자에게 물어봤지만 아직 답을 못 받은 것들 — (1) 변정훈(order 10) 영문 타이틀이 로마자 표기(`Byeon Jeonghun`) 없이 한글 그대로인 것 확인 필요. (2) BAZZAR Cover(order 19) 제목 스펠링이 실제 매거진명(Harper's BAZAAR)과 다른데 그대로 둘지 확인 필요. (3) 닭다리(order 22)에 실제 영상 링크(`videoUrl`)가 있으면 추가 요청받았으나 링크를 못 받음 — 유지로 확정됨(더 손 안 대는 걸로 사용자가 정리함). (4) FC COANT(order 25)는 크레딧 없이 넘어감(사용자 확인).

**하면 안 되는 일**: `RollingNumber.tsx`에 `tabular-nums`나 폰트 굵기 변경을 다시 시도하지 말 것 — 레이아웃 자체는 문제 없다고 실측으로 확인됐고, 사용자가 "애매하다"며 원복을 택함. 재작업 필요하면 사용자가 먼저 다시 요청할 것. `heroMedia`/`stackedMedia`/`heroPortrait`는 명시적으로 지정된 작업에만 있고 나머지 작업은 그대로 자동 로직(전체 순서/슬러그 랜덤 7장/실제 비율 자동판별)을 타므로, 이 필드들이 없는 작업에 굳이 채워 넣을 필요 없음(자동 동작이 기본값).

**검증 방법**: `git log --oneline -3`에 `47119f0`가 최신, `git status`가 clean, `origin/main`과 동기화(`git status -sb`에 ahead/behind 없음)인지 확인. 브라우저에서 `http://localhost:3000/works`(그리드) → 아무 작업이나 눌러서 상세페이지 진입 → 이미지 확대(라이트박스) 후 Esc(닫힘) → 다시 Esc(그리드로 나감) 확인. 정사각 커버 작업(예: `/works/2026-04-in-your-eyes`, `/works/2024-04-bulnabang`)에서 이미지가 크롭 없이 세로처럼 나오는지, 매거진 작업(`/works/2026-13-magazine-a-movie-land`, `/works/2026-11-magazine-a-uzun`)에서 히어로/스택이 지정한 이미지만 나오는지 확인.

**참고**: `components/WorkDetail.tsx`(`heroPortrait`/`heroMedia`/`stackedMedia` 처리 로직, Esc 핸들러), `lib/works.ts`(`WorkMeta` 타입), `content/works/README.md`(신규 필드 문서화), 커밋 `bef77f1`(코드)·`47119f0`(콘텐츠). order↔slug 매핑은 직전 항목(2026-08-27 02:40) 참고 항목에 표로 정리돼 있음.

## 2026-08-27 02:40 — About CV 문구 수정, Works 그리드 UI 조정, 메인 히어로 featured 선별

**지금 상태**: 여러 작은 요청을 순서대로 처리함(전부 미커밋, `git status` 기준 수정 상태).
1. `components/AboutSection.tsx:60` — CV 항목 중 "디자인 에이전시 인턴십"(한글 subtitle만) → "디자인 에이전시 인턴십 근무"로 텍스트 추가. 영문 title은 그대로.
2. `components/WorksGrid.tsx:28` — 옛 헤더 높이 기준 leftover였던 `pt-[9.89583vw]`(190px)를 실제 헤더 높이(`h-[8.85417vw]`, 170px)에 맞춰 `pt-[8.85417vw]`로 수정(간격 0).
3. `components/WorksGrid.tsx` 왼쪽 카테고리 `<nav>` — `sticky top-[8.85417vw] h-fit` 추가해서 그리드 스크롤해도 헤더 바로 아래 붙어서 따라 내려오게 함(기존엔 `relative`만 있어서 스크롤하면 그냥 사라졌음).
4. `components/WorksGrid.tsx` 카드 호버 시 연도 텍스트 — 크기 `0.84375vw`(16.2px)→`0.885417vw`(17px), 색상 `text-white/70`→`text-white/60`.
5. **메인 페이지 히어로 selection 기능 추가**: 지금까지 `app/page.tsx`가 `getAllWorks()`(27개 전부)를 히어로 슬라이드로 썼는데, 사용자가 지정한 순번(현재 order 기준 1,2,3,8,11,12,14,18,20,21,23) 중 2번("10 PURE Freestyle")은 이후 빼달라고 해서 최종 10개만 노출되도록 함. 구현: `WorkMeta`에 `featured?: boolean` 필드 추가, `lib/works.ts`에 `getFeaturedWorks()`(= `getAllWorks().filter(w => w.featured)`, order 정렬은 `getAllWorks()`가 이미 처리) 추가, `app/page.tsx`가 `getAllWorks()` 대신 `getFeaturedWorks()` 사용하도록 교체. 해당 10개 작업(`content/works/2026-16-uzun-bi`, `2026-14-jeju`, `2026-09-movie-land`, `2026-06-bamselluth`, `2026-05-eol`, `2026-03-jbl-go-4`, `2025-05-iphone-obscura`, `2025-03-waffle`, `2025-02-hongyeon`, `2024-05-mosaic`)의 `meta.json`에 `"featured": true` 추가. `/works` 그리드 페이지는 그대로 `getAllWorks()`(27개 전체) 유지 — featured는 메인 히어로 전용 필터.

**남은 일**: 사용자가 다음 작업으로 **"프로젝트별 크레딧이랑 이것저것 상세페이지 수정, 1번부터 27번까지 차례대로"**를 요청함(order 1~27 순서, 위 order↔slug 매핑은 아래 참고 항목 표 참조). 항목별로:
- `credit` 필드(스키마는 있으나 27개 전부 미채움, `WorkCredit = {role, name}[]`) 채우기
- 지난 세션에 미룬 "2번" 항목 — 8장 초과 작업의 하단 스택 이미지 섹션(`WorkDetail.tsx`의 `showStacked`, 현재 `object-cover`/`object-contain` 분기 없이 자연비율 그대로)도 "크레딧 정리하면서 프로젝트별로 같이 맞추기"로 사용자가 확정함 — 크레딧 작업과 묶어서 진행할 것
- 그 외 사용자가 프로젝트마다 짚어줄 "이것저것" 상세페이지 수정(구체 항목은 세션 진행하면서 사용자가 하나씩 지시할 예정, 아직 목록화 안 됨)
- 진행 순서는 반드시 order 1번(`2026-16-uzun-bi`)부터 27번(`2024-01-giwon`) 순서대로, 건너뛰지 말 것

**하면 안 되는 일**: 히어로/스택 이미지 크롭 관련 과거 결정 뒤집지 말 것 — 세로 사진에 `object-cover` 재적용 금지(크롭 때문에 반려됨), 이는 [[스택 이미지 섹션에도]] 적용될 예정이니 스택 섹션 작업 시에도 세로/가로 orientation 분기(heroPortrait 패턴과 동일하게) 적용할 것. featured 목록의 순서나 구성원을 임의로 바꾸지 말 것(사용자가 명시적으로 확정한 10개).

**검증 방법**: `http://localhost:3000`(메인, featured 10개 슬라이드), `http://localhost:3000/works`(그리드 27개 + sticky 카테고리 nav + 연도 텍스트 크기/색상), `http://localhost:3000/about`(CV "인턴십 근무" 문구) 확인. 포트 3000에 uzun-choi 전용 `next-server`(PID는 `lsof -ti:3000`으로 확인) 하나만 떠 있어야 정상.

**참고**: order↔slug 매핑 전체(1~27, `content/works/*/meta.json`의 `order` 필드 기준): 1 uzun-bi(2026-16), 2 pure-freestyle(2026-15, featured 아님), 3 jeju(2026-14), 4 movie-land-magazine(2026-13), 5 0000(2026-12), 6 uzun-magazine(2026-11), 7 dotters(2026-10), 8 movie-land(2026-09), 9 derick(2026-08), 10 byeonjeonghun(2026-07), 11 bamselluth(2026-06), 12 eol(2026-05), 13 in-your-eyes(2026-04), 14 jbl-go-4(2026-03), 15 biraksikhye(2026-02), 16 noknok(2026-01), 17 nukumori(2025-06), 18 iphone-obscura(2025-05), 19 bazzar-cover(2025-04), 20 waffle(2025-03), 21 hongyeon(2025-02), 22 dakdari(2025-01), 23 mosaic(2024-05), 24 bulnabang(2024-04), 25 fc-coant-logo(2024-03), 26 guseok(2024-02), 27 giwon(2024-01). `lib/works.ts`(`getFeaturedWorks`), `app/page.tsx`, `components/WorkDetail.tsx`(크레딧 렌더링 위치 확인 필요 — 아직 credit 표시 UI 자체를 안 봄, 있는지부터 확인할 것).

## 2026-08-26 02:35 — 코드 변경 없음, 프로젝트 히스토리를 옵시디언 노트로 정리

**지금 상태**: 이번 세션은 코드 작업이 아니라 문서화 세션이었음 — 직전 항목(2026-08-23 13:02)에서 끝난 히어로 레이아웃 상태 그대로, 코드/git diff 변화 없음(`git diff --stat` 동일). 사용자 요청으로 프로젝트 전체 기록과 고민 과정(특히 히어로 레이아웃 삽질)을 옵시디언 볼트(`~/Documents/Obsidian Vault/uzun-choi 웹 포트폴리오/`)에 노트 4개로 정리함: 허브 노트("uzun-choi 웹 포트폴리오"), "uzun-choi 초기 구축과 페이지 작업", "uzun-choi Works 콘텐츠 교체 작업", "uzun-choi 상세페이지 히어로 레이아웃 삽질기"(가장 상세, 크롭/레터박스 반려·Chrome-Safari 미스터리·Figma 재조회 돌파구·헤더 padding 버그·서버 포트 충돌·박스 크기 조정·fill 용어 혼선까지 시간순 기록). HANDOFF.md의 과거 로그를 소스로 씀.

**남은 일**: 직전 항목(2026-08-23 13:02)의 남은 일 그대로 유효함 — (1) 사용자 최종 눈 확인, (2) 8장 초과 스택 이미지 섹션에 crop/contain 분기 미적용, (3) `WorksGrid.tsx`의 `pt-[9.89583vw]` leftover 방치, (4) Credit 필드 실데이터 미채움. 옵시디언 노트 쪽은 추가로 필요한 게 생기면(새 세션 내용 등) 같은 폴더에 이어서 기록하면 됨 — 노트를 지우거나 덮어쓰지 말 것(옵시디언 쪽도 이 프로젝트 HANDOFF와 같은 append 원칙).

**하면 안 되는 일**: 직전 항목과 동일, 변경 없음.

**검증 방법**: 포트 3000에 uzun-choi 전용 `next-server`(PID는 `lsof -ti:3000`으로 확인, 이번 세션 기준 53533/부모 53532) 하나만 떠 있어야 정상 — lsof에 Chrome/WebKit 헬퍼 프로세스가 같이 잡히는 건 무시해도 됨(실제 서버 아님). 옵시디언 노트는 `~/Documents/Obsidian Vault/uzun-choi 웹 포트폴리오/` 4개 파일로 확인 가능.

**참고**: HANDOFF.md 직전 항목들(특히 2026-08-23 13:02, 2026-08-23 "이어서"/"추가" 세 개) — 이번 옵시디언 노트의 소스 그대로임. 옵시디언 노트: `uzun-choi 웹 포트폴리오.md`(허브), `uzun-choi 상세페이지 히어로 레이아웃 삽질기.md`(가장 자세함).

## 2026-08-23 13:02 — 히어로 박스 크기 확정(1520 기준) + 세로 사진 crop→contain 전환

**지금 상태**: 직전 항목들에서 다진 히어로 레이아웃을 이번 세션에서 계속 다듬어 아래 상태로 확정함(전부 `components/WorkDetail.tsx`).
1. 서버 정리: 3000번 포트에 떠 있던 게 uzun-choi가 아니라 다른 프로젝트(`design-gb-2026`)의 `next dev`였던 걸 발견 → 사용자 확인 후 종료. 검증용 `next.config.ts`의 `distDir: ".next-verify"`도 원복(현재 `git diff next.config.ts` 클린), `.next-verify` 삭제. 지금은 uzun-choi 전용 `next dev -p 3000` 하나만 떠 있음.
2. 히어로 상단 여백: `pt-[8.85417vw]`(헤더 실제 높이 170px 기준, 간격 0) → 사용자 요청으로 30px(1920 기준) 추가로 위로 올려 `pt-[7.291667vw]`로 확정.
3. 히어로 박스 크기: Figma 원본(1793×890, `93.385417vw × 46.354167vw`)에서 두 차례 축소 시도(1440 → 반려, 1520 → 확정) 끝에 구조를 다음과 같이 확정: **바깥 밴드는 Figma 원본 크기(`93.385417vw × 46.354167vw`, mx-auto)를 그대로 유지**해서 타이틀(bottom-left)·스크롤버튼(bottom-right)이 원래 위치에 고정되고, **그 안의 사진 박스만 1520×855.661px**(1581:890 비율 유지)로 줄여서 `w-[79.166667vw] h-[44.565679vw] left-[7.109375vw]`로 가로 중앙 정렬. 사진이 밴드보다 작아지면서 밴드 하단에 여유 공간이 생기고 타이틀/스크롤은 그 여유 공간 위쪽, 사진 안쪽에 걸치는 형태.
4. 세로/가로 사진 처리 분기: 가로 사진은 기존대로 `object-cover`(크롭해서 박스 꽉 채움, Figma 스펙과 일치). **세로 사진은 크롭하면 대부분 잘려나가는 문제가 있어서, 사용자가 "박스 높이에 맞춰 세로만 채우고(크롭도 왜곡도 없이) 좌우는 남는 대로 두자"고 확정** → `object-contain`으로 전환. `heroIndex` state 옆에 `heroPortrait` state를 추가하고 `<img onLoad>`에서 `naturalHeight > naturalWidth`로 세로/가로 판별해서 `object-contain`/`object-cover`를 동적으로 전환. 좌우 여백은 어차피 배경(`bg-[#0c0c0c]`)과 같은 검정이라 티 안 남.

**남은 일**: (1) 사용자 최종 눈으로 재확인 필요(계속 강조돼온 부분 — 이번엔 3000번 uzun-choi 전용 dev로 직접 봄). (2) 8장 초과시 하단 스택 이미지 섹션(`showStacked`)은 여전히 손 안 댐 — Figma상 `object-cover` 고정 높이인데 코드는 `block w-full`(auto height, no crop) 그대로. 세로/가로 분기 처리도 아직 없음. 필요하면 히어로와 동일한 패턴(orientation 판별 + contain/cover 분기) 적용할 것. (3) `WorksGrid.tsx`에 남아있는 동일한 `pt-[9.89583vw]` leftover는 여전히 방치 상태(사용자가 그리드 페이지는 안 물어봄). (4) `credit` 필드 실데이터 27개 미채움.

**하면 안 되는 일**: 히어로 밴드(바깥 wrapper) 크기를 줄이지 말 것 — 타이틀/스크롤 버튼 위치가 거기 고정되어 있음, 줄이면 사용자가 반려했던 "타이틀도 같이 작아지는" 상태로 돌아감. 세로 사진에 `object-cover`를 다시 쓰지 말 것(크롭 때문에 반려됨). 포트 3000이 다른 프로젝트(`design-gb-2026`)와 충돌할 수 있으니, uzun-choi 작업 재개 전 `lsof -ti:3000`으로 뭐가 떠 있는지 먼저 확인할 것.

**검증 방법**: `npm run dev`(또는 `npx next dev -p 3000`)로 uzun-choi 단독 서버 실행. `http://localhost:3000/works/2026-09-movie-land`(가로, cover 확인), `http://localhost:3000/works/2025-02-hongyeon`(세로, contain 확인 — 반지 사진 전체가 크롭 없이 다 보여야 함) 두 곳 크로스체크. 1920px 뷰포트로 맞추고 DOM `getBoundingClientRect()`로 실측하면 헤더-히어로 간격 0, 밴드 1793×890, 사진박스 1520×855.66 나와야 함(1vw = innerWidth/100로 환산).

**참고**: `components/WorkDetail.tsx` 히어로 섹션 전체(파일 상단, `heroPortrait` state와 `<main>` 첫 `<div>` 블록). Figma "UC WEB" "4. Details - standard"(`363:746`).

## 2026-08-23 (이어서) — 히어로 레이아웃 버그 원인 확인 및 수정 완료

**지금 상태**: 직전 항목에서 미해결이던 히어로 캐러셀 레이아웃 문제를 Figma "4. Details - standard"(node `363:746`) 재조회로 해결함. 근본 원인: Figma 원본은 히어로 이미지를 자연비율(auto height)이 아니라 **고정 크기 박스(1581×890px @1920 기준 = 82.34375vw × 46.354167vw) + `object-cover`(크롭해서 꽉 채움)** 구조였음 — "크롭 없음"과 "레터박스 없이 꽉 채우기"가 충돌하는 게 아니라, Figma 자체가 크롭 쪽을 선택한 것. `components/WorkDetail.tsx`의 히어로 `<img>`를 `block w-full`(auto height, no crop) → `absolute h-full w-[82.34375vw] object-cover`로 교체, 바깥 wrapper를 `w-[82.34375vw]`(이미지 폭만) → `h-[46.354167vw] w-[93.385417vw]`(Figma의 "Thumbnail/carousel" 컨테이너 폭)로 변경하고 이미지를 그 안에서 `left-[5.729167vw]` 오프셋으로 배치. 타이틀(`UZUN CHOI 2026`)은 이미지 왼쪽 끝이 아니라 이 넓은 컨테이너의 왼쪽 끝(=본문 Description/Credit과 같은 페이지 좌측 여백) 기준으로 정렬되도록 함 — Figma에서 타이틀이 이미지보다 살짝(110px/1920 = 5.73vw) 왼쪽으로 나가 있는 걸 그대로 반영. 가로(영화관 사진, 3:2), 세로(반지 사진), 24장 와이드 스틸컷 3가지로 Chrome 스크린샷 교차 확인 완료 — 전부 레터박스 없이 박스 꽉 채움.

**남은 일**: (1) **사용자 실제 화면(Safari)에서 재확인 필요** — 직전 세션에서 Chrome은 정상인데 Safari에서 다르게 보였던 미해결 미스터리가 있었음, 이번 수정도 Chrome 검증만 했으므로 사용자 눈으로 최종 확인 전까지 "완료"로 단정하지 말 것. (2) 8장 초과시 하단 스택 이미지 섹션(`showStacked`)도 Figma상 `object-cover` 고정 높이(1014.972px @1920 = 52.859vw, 폭은 본문과 동일 93.90625vw)로 되어 있는데 현재 코드는 여전히 `block w-full`(auto height, no crop)임 — 이번엔 "히어로"만 요청받아서 손대지 않음, 필요시 동일 패턴 적용. (3) `credit` 필드 실데이터 27개 미채움 — 그대로.

**하면 안 되는 일**: 히어로는 반드시 고정 크기 박스 + `object-cover`로 — natural aspect/auto height로 되돌리면 직전 세션에서 겪은 "사진마다 높이 들쭉날쭉" 문제 재발함. Chrome 검증만으로 "고쳐졌다"고 사용자에게 보고하지 말 것(위 남은 일 (1) 참고).

**검증 방법**: 포트 3200 서버(`next start`, `.next-verify` 빌드) 살아있음. `http://localhost:3200/works/2026-09-movie-land`(가로), `http://localhost:3200/works/2025-02-hongyeon`(세로), `http://localhost:3200/works/2026-15-10-pure-freestyle`(24장) 3개 비교. 재빌드 시 `npx next build && npx next start -p 3200`(`distDir: ".next-verify"` 유지).

**참고**: `components/WorkDetail.tsx` 히어로 섹션(파일 상단 `<main>` 안 첫 `<div>` 블록). Figma "UC WEB" 파일 "4. Details - standard"(`363:746`) — 특히 `Thumbnail/carousel`(`627:604`, 1793×890) / `proj`(`608:426`, 1581×890, object-cover) 노드.

## 2026-08-23 (추가) — "처진" 느낌 리포트 → 헤더 패딩 leftover 값 버그 발견 및 수정

**지금 상태**: 사용자가 "스크롤 버튼/타이틀/이미지 위치가 좀 쳐진 것 같다"고 재문제 제기. Chrome JS로 실제 뷰포트 1920px에서 DOM `getBoundingClientRect()` 실측 → 히어로 박스 크기·위치는 Figma 1920 기준값과 소수점까지 정확히 일치(오차 없음), 즉 vw 공식 자체는 문제 없었음. 대신 `Header.tsx`가 `fixed` 헤더로 실제 높이 `h-[8.85417vw]`(170px@1920)인데, `WorkDetail.tsx`의 `<main>`은 `pt-[9.89583vw]`(190px, 옛 헤더 높이 기준 leftover — 2026-08-18 항목에서 WorksGrid/MenuOverlay에 이미 발견됐던 것과 동일한 값이 WorkDetail에도 그대로 들어가 있었음)를 쓰고 있어서 헤더-히어로 사이에 1920 기준 20px 여백이 떠 있었음. `pt-[8.85417vw]`로 수정 → 재빌드 후 1920px 뷰포트 실측으로 간격 0(완전히 붙음) 확인.

**남은 일**: (1) 사용자에게 최종 확인 요청(Safari 실제 화면). (2) `WorksGrid.tsx`도 동일한 `pt-[9.89583vw]` leftover가 남아있음(2026-08-18 항목에서 "시각적으로 문제없어 보여서 그대로 둠"이라고 의도적으로 방치한 상태) — 이번엔 손대지 않았으나, 사용자가 그리드 페이지도 같이 봐달라고 하면 동일하게 `pt-[8.85417vw]`로 바꿀 것.

**하면 안 되는 일**: 없음.

**검증 방법**: 브라우저 뷰포트를 정확히 1920px로 맞추고(`resize_window` 등) `document.querySelector('header').getBoundingClientRect().bottom`과 히어로 wrapper `.getBoundingClientRect().top`의 차이가 0인지 확인. 뷰포트가 1920이 아니면 브라우저 chrome/OS 스케일링 때문에 `window.innerWidth`가 다르게 나올 수 있으니 반드시 `window.innerWidth`를 같이 로그해서 실제 배율로 환산할 것(1vw = innerWidth/100).

**참고**: `components/WorkDetail.tsx:50`(`pt-[8.85417vw]`로 수정됨), `components/Header.tsx:17`(`h-[8.85417vw]`, fixed 헤더). `components/WorksGrid.tsx:28`에 동일 leftover(`pt-[9.89583vw]`) 여전히 남아있음.

## 2026-08-23 11:34 — 작업 상세페이지(/works/[slug]) 신규 구현, 히어로 이미지 레이아웃 미해결 상태로 중단

**지금 상태**: Figma "4. Details - standard" 프레임(node `363:746`) 기준으로 `/works/[slug]` 상세페이지를 새로 구현함 — `app/works/[slug]/page.tsx`, `components/WorkDetail.tsx`(캐러셀+Description+Credit+8장 초과시 하단 스택 이미지+라이트박스), `lib/works.ts`에 `getWork`/`getWorkMedia`/`getWorkDescription` 추가 및 `WorkMeta`에 `credit`(`{role,name}[]`)·`videoUrl` 필드 추가, `WorksGrid.tsx` 카드를 상세페이지로 링크, `Header.tsx`는 상세페이지에서 메뉴 아이콘 대신 X(누르면 `/works`로)로 바뀌게 처리, `ScrollNav.tsx`에 `className`/`disabled` prop을 추가해 홈 히어로와 상세페이지 캐러셀이 같은 스크롤 버튼 컴포넌트를 공유하도록 함. 라이트박스는 닫기 아이콘 진짜 X로 회전 수정, 좌우 화살표 방향 수정, 클릭시 추가 확대(zoom+스크롤) 기능까지 완료. **다만 히어로 캐러셀 이미지 레이아웃은 여러 번 갈아엎었는데도 사용자가 마지막에 "완전 잘못됐다"고 재차 문제 제기했고, 정확히 뭐가 잘못됐는지 스크린샷을 요청한 채로 세션이 종료됨 — 미해결.**

**남은 일**: (1) 사용자가 보낼 스크린샷으로 실제 증상부터 다시 확인할 것(추측 금지). (2) 히어로 이미지 레이아웃 요구사항이 세션 내내 계속 바뀌었음 — "크롭 없음" / "가로 이미지와 높이 통일" / "레터박스 없이 꽉 차게" 가 서로 충돌하는 요구라는 걸 사용자에게 먼저 명확히 설명하고 하나를 확정받고 시작할 것. (3) `credit` 필드는 스키마만 추가됐고 27개 작업 실데이터는 하나도 안 채워짐 — 다음 단계. (4) 나머지(About/QA/배포)는 기존 로드맵 그대로, 변경 없음.

**하면 안 되는 일**: `object-fit: contain` + 고정 높이 박스 조합은 사진 비율이 프레임(16:9 비슷)과 안 맞으면 레터박스가 크게 남아서 사용자가 명시적으로 거부함(영화관 사진 예시로 확인) — 다시 시도하지 말 것. `w-fit` shrink-wrap 방식도 시도했으나 그 다음에도 불만이 나왔음. **가장 중요한 함정**: 내 Chrome 브라우저 테스트로는 "정상"이라고 여러 차례 확인했는데 사용자의 실제 화면(Safari)에서는 계속 다르게/잘못 보인다고 함 — 처음엔 캐싱 문제로 추정했지만 빌드 타임스탬프로 반증됨(원인 불명, 아직 안 풀림). **Chrome 자체 검증만으로 "고쳐졌다"고 사용자에게 보고하지 말고, 반드시 사용자의 실제 스크린샷으로 재확인 후 보고할 것.**

**검증 방법**: 서버가 포트 3200에 떠 있음(`next start`, `.next-verify` 빌드, PID는 `lsof -ti:3200`으로 확인). `http://localhost:3200/works/2026-09-movie-land`(가로 3:2 사진, 레터박스 이슈 재현했던 작업), `http://localhost:3200/works/2025-02-hongyeon`(세로 사진), `http://localhost:3200/works/2026-15-10-pure-freestyle`(24장, 와이드 스틸컷) 세 가지 비율로 교차 확인 필요. 재빌드 시 `next.config.ts`의 `distDir: ".next-verify"` 유지한 채 `npx next build && npx next start -p 3200`.

**참고**: `components/WorkDetail.tsx`(현재 히어로는 `w-[82.34375vw]` 고정폭 + 높이 자연 비율, 크롭/레터박스 없음 — 되돌린 버전), `components/ScrollNav.tsx`, `components/Header.tsx`, `lib/works.ts`. Figma 파일 "UC WEB"의 "4. Details - standard" 프레임(`363:746`)이 원본 스펙. `next.config.ts`에 검증용 `distDir` 변경이 커밋 안 된 채 남아있음(의도된 임시 상태, 작업 재개 시 그대로 두고 써도 됨).

## 2026-08-20 01:09 — 27개 실작업 교체 건 커밋 완료 (a6e66de)

**지금 상태**: 직전 항목(01:03)에서 정리한 작업 전체를 `a6e66de` 커밋 1개로 반영함("Replace dummy works with 27 real projects, add editorial category", 393 files changed). dummy-01~20·sanjeong 삭제, 27개 실작업 폴더 추가, `lib/works.ts`/`WorksGrid.tsx`/`app/page.tsx`/`content/works/README.md`/`.gitignore`/`CLAUDE.md` 수정 모두 포함. `git status` clean. `content/works/input_contents/`(원본 백업, ~1.1GB)는 계획대로 커밋에서 제외됨(.gitignore). push는 안 함.

**남은 일**: (1) `/works/[slug]` 상세 페이지 제작 — 미착수. (2) 최종 QA(반응형, 접근성, Lighthouse)와 배포 — 미착수. (3) 원격에 push할지는 아직 안 물어봤음.

**하면 안 되는 일**: 직전 항목(01:03)과 동일 — `input_contents/` 삭제 금지, 커버 이미지 임의 재선정 금지.

**검증 방법**: `git log --oneline -3`에 `a6e66de`가 최신이어야 함. `git status`가 clean해야 함(HANDOFF.md 이번 커밋 반영 전이면 `?? HANDOFF.md` 한 줄만 남아있는 게 정상).

**참고**: 직전 항목(2026-08-20 01:03) 참고. 커밋 해시 `a6e66de`.

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

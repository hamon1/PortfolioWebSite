# UI/UX Specification: Developer Portfolio Website

## 1. Design Principles & Concept
* **Minimal & Professional:** 개발자로서의 전문성을 보여줄 수 있도록 군더더기 없고 깔끔한 레이아웃을 지향합니다.
* **Developer-Friendly Tech Vibe:** 다크 모드를 기본(또는 지원)으로 하며, 코드 블록이나 터미널 느낌의 포인트를 주어 개발자 감성을 살립니다.
* **Content-First:** 화려한 애니메이션보다는 텍스트 가독성과 포트폴리오 프로젝트의 시각 자료가 돋보이도록 합니다.

## 2. Layout & Structure
웹사이트는 반응형(Responsive)으로 제작하며, 모바일-태블릿-데스크톱 환경을 모두 지원합니다.

* **Navigation Bar:** 상단 고정 (Sticky). 로고(이름), 메뉴(About, Projects, Experience, Contact), 다크/라이트 모드 토글.
* **Hero Section:** 첫인상을 결정하는 구역. 짧고 강렬한 한 줄 소개, 직무, Github/Email 링크 버튼.
* **About Me:** 간단한 자기소개, 기술 스택(Tech Stack) 아이콘 grid.
* **Projects Section:** 카드 레이아웃. 프로젝트 썸네일, 제목, 사용 기술(태그 형태), 핵심 성과, GitHub/Live Demo 링크.
* **Contact:** 깔끔한 푸터(Footer) 또는 연락처 섹션.

## 3. Design System (Theme & Tokens)

### Color Palette
* **Primary (Brand):** `#4F46E5` (Indigo-600) - 주요 버튼, 강조 텍스트, 링크
* **Dark Mode (Default):**
    * Background: `#0F172A` (Slate-900)
    * Surface (Cards, Nav): `#1E293B` (Slate-800)
    * Text Primary: `#F8FAFC` (Slate-50)
    * Text Secondary: `#94A3B8` (Slate-400)
* **Light Mode:**
    * Background: `#F8FAFC` (Slate-50)
    * Surface: `#FFFFFF`
    * Text Primary: `#0F172A` (Slate-900)
    * Text Secondary: `#475569` (Slate-600)

### Typography
* **Font Family:** Sans-serif 계열 (Pretendard 또는 Inter 추천), 코드 및 기술 태그에는 Monospace font (JetBrains Mono 또는 Fira Code) 적용.
* **Hierarchy:**
    * H1 (Hero Title): `3rem / Bold`
    * H2 (Section Title): `2rem / SemiBold`
    * H3 (Card Title): `1.25rem / Medium`
    * Body: `1rem / Regular` (Line-height: 1.6로 가독성 확보)

## 4. Components & Interactive Elements
* **Buttons:** * Primary: 배경색이 채워진 버튼 (Hover 시 약간 밝아지거나 그림자 효과).
    * Secondary: 테두리만 있는 Outline 버튼.
    * 모든 버튼은 클릭 가능한 영역임을 나타내는 `cursor: pointer`와 부드러운 `transition` 효과 필수.
* **Project Cards:** Hover 시 살짝 위로 올라가는(`translate-y`) 효과와 은은한 그림자(Shadow) 효과 적용.
* **Tech Stack Tags:** 연한 회색/네이비 배경에 Monospace 폰트로 작게 표시.

## 5. Animation Guidelines
* 과도한 유저 인터랙션 방해 금지.
* 페이지 로드 시 Hero Section의 텍스트가 부드러운 Fade-in 되거나 위로 솟아오르는 효과 정도만 적용 (`duration: 300ms`, `ease-in-out`).
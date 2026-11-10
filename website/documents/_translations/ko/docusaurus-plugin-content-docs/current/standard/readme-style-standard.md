---
title: README 작성 기준
sidebar_label: README 작성 기준
description: Docnest의 README와 CONTRIBUTING 역할, 언어 배지, 스펙 표와 문서 작성 기준입니다.
slug: /standard/readme-style-standard
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

> 이 문서는 dino-nest에서 가져온 검증용 예제입니다. 표·제목·링크·번역된 탐색 메뉴의 렌더링을 확인합니다. Dino Ovum 저장소의 작업 방법은 [README](https://github.com/4BFC/dino-ovum#readme)를 참고하세요.


Docnest의 사용자 안내와 개발 안내를 작성하는 기준입니다. 공통 작성 기준은 `documents/standard/`에 모으고 사이트에서 함께 공개합니다.
[Standard Readme 명세](https://github.com/RichardLitt/standard-readme/blob/main/spec.md)의 기본 구조와
[Shelter README](https://github.com/4BFC/shelter), [Shelter 문서 작성 기준](https://github.com/4BFC/shelter/blob/main/CONTRIBUTING.md#writing-documentation)의 언어 배지와 스펙 표 형식을 참고합니다.

## 문서 역할 {#document-roles}

| 문서 | 독자와 목적 | 포함하는 내용 |
| --- | --- | --- |
| README | Docnest를 사용하는 사람 | 제품 소개, 간단한 스펙, 설치, 문서 작성과 기본 사용법 |
| CONTRIBUTING | 코드를 수정하고 관리하는 사람 | 개발 환경, 소스 책임, 검사, 커밋, 배포 절차 |
| `src/README.md` | 구조를 파악하는 개발자 | 디렉터리별 책임과 의존 방향 |
| `documents/standard/` | 문서를 유지하는 사람 | 저장소의 공통 작성 기준 |

README에 내부 라우팅 구현, 플러그인 예외, 린트 명령과 개발 도구 설명을 늘어놓지 않습니다.
사용자가 처음 실행하는 데 필요한 최소 설치 명령은 README에 두고, 상세 환경 설정은 CONTRIBUTING으로 연결합니다.

## README 구성 {#readme-structure}

1. 테마에 맞는 프로젝트 로고, 제품명, 한 문장 소개, 제품 배지를 둡니다. 영문 소개는 `package.json`의 `description`과 맞춥니다.
   상단 배지 모음에 Standard Readme 배지를 넣고 원본 프로젝트로 연결합니다. 별도의 작성 기준 안내 문구는 넣지 않습니다.
2. 언어 선택, 목차, 스펙, 설치, 사용법, 주요 기능, 관리자, 기여, 라이선스 순서로 씁니다.
3. 목차는 모든 2단계 제목에 연결하고, 라이선스는 마지막에 둡니다.
4. 사용법에는 실제 동작하는 짧은 명령이나 문서 예시와 예상 결과를 함께 적습니다.
5. 준비되지 않은 기능과 배포 주소를 사용 가능한 것으로 표현하지 않습니다.

Standard Readme를 프로젝트에 맞게 적용합니다. Shelter처럼 사용자가 실행 조건을 먼저 확인하도록
스펙을 설치 앞에 두며, 번역 파일도 표준의 `README.<언어>.md` 대신 아래 디렉터리 구조를 사용합니다.
Standard Readme 배지는 작성 스타일의 출처로 연결하며, 프로젝트별 적용 방식은 이 문서에서 관리합니다.

## 언어 표기와 경로 {#languages-and-paths}

- 루트 README와 CONTRIBUTING은 영어로 제공하고 `language/eng/`의 영어 본문과 일치시킵니다.
- 영어는 `language/eng/`, 한국어는 `language/ko/`, 일본어는 `language/jp/`에 둡니다.
- 모든 언어 폴더에 `README.md`, `CONTRIBUTING.md`를 둡니다. 파일명은 번역하지 않습니다.
- 상단에 가운데 정렬한 HTML 표로 English, 한국어, 日本語 배지를 표시합니다.
- 현재 언어는 `0969DA`, 다른 언어는 `555555`로 표시하고 `style=flat-square`를 사용합니다.
- 각 배지는 같은 종류의 문서로 연결합니다. CONTRIBUTING의 언어 선택은 해당 언어 CONTRIBUTING으로 이동합니다.
- 경로는 각 파일 기준 상대경로입니다. 실행 명령은 모두 저장소 루트를 기준으로 합니다.
- 사이트 언어는 `en`, `ko`, `ja`이며, 영어 원문은 `documents/`에 둡니다.
- 한국어와 일본어 문서는 `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/`에 두고 원문과 파일명, slug를 맞춥니다.
- UI 번역은 각 언어의 `code.json`에 둡니다. `_translations`는 영어 문서 트리에서 제외됩니다.
- 언어 선택은 현재 문서의 번역본으로 이동합니다. 번역 내용과 고정된 제목 ID를 함께 관리합니다.
- 폴더 이름 `eng`, `jp`는 저장소 안내서의 배치 이름이며 사이트 locale 코드가 아닙니다.

## 스펙 표기 {#specifications}

스펙 표는 구성, 기술 배지, 사용자에게 필요한 설명의 세 열로 구성합니다.
기술 배지에 실제 버전, `style=flat-square`, 제공되는 기술 아이콘을 넣습니다.
README에는 주요 실행 환경과 기반 기술만 남기고, 모든 개발 의존성을 나열하지 않습니다.

버전의 근거는 `package.json`과 `pnpm-lock.yaml`로 연결합니다.
선언된 버전 범위와 lockfile에 고정된 버전을 구분합니다. Node.js 24는 지원 계열이며
최소 버전과 상한은 별도로 적습니다. 버전이 바뀌면 모든 언어의 표를 함께 갱신합니다.

## 작성과 검증 {#writing-and-checks}

- 짧은 문장, 단계별 사용법, 비교 가능한 표를 사용합니다.
- 코드 블록에 언어를 명시하고 제목, 목록, 표 앞뒤에 빈 줄을 둡니다.
- 사용자 화면의 명칭과 명령, 경로, 버전은 번역 중 임의로 바꾸지 않습니다.
- 루트 영어 문서와 세 언어 문서의 내용, 명령, 목차, 상대 링크를 함께 확인합니다.
- Markdown 미리보기에서 언어 선택, 기술 배지, 표, 코드 블록과 테마별 README 로고를 확인합니다.
- 사이트의 모든 문서를 세 언어, 모바일 탐색, 라이트와 다크 모드에서 확인합니다.
- 제품 UI의 언어 지원과 저장소 문서 번역을 구분합니다.
- README와 CONTRIBUTING은 공개 사이트 콘텐츠인 `documents/`에 넣지 않습니다.

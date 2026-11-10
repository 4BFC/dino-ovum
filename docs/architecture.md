# 아키텍처

## 목적과 현재 상태

Dino Ovum은 dino-nest의 공통 기능과 디자인을 두 패키지로 제공합니다. 사용자는 자신의 문서·브랜딩·설정을 유지하면서 패키지 업데이트로 공통 개선 사항을 받습니다.

`@dino-ovum/preset`과 `@dino-ovum/theme`의 0.1.0 구현 및 검증용 `website/`가 있습니다. 공통 코드의 분리 기준은 dino-nest의 `aa0335e1864457f7f578256a6e177d0b6cb42dca` 커밋입니다. 원본 저장소의 미커밋 작업은 가져오지 않았습니다. 두 패키지 0.1.0은 npm에 공개했으며 dino-nest의 실제 전환은 후속 단계입니다.

## 저장소 경계

- **dino-ovum**: 두 패키지의 공통 소스, 패키지 검증 사이트, 테스트, 한국어 개발 문서를 관리합니다.
- **dino-nest**: 사용자가 복사하는 사이트 템플릿입니다. 패키지로 이전한 뒤에도 사용자 문서·로고·설정·추가 페이지를 보관합니다.
- 사용자 사이트에는 패키지 개발 소스나 검증용 사이트를 복사할 필요가 없습니다.

```text
dino-ovum/
├── packages/
│   ├── preset/src/              설정 도우미, 사이드바, 빌드 플러그인
│   └── theme/src/
│       ├── theme/              Docusaurus 확장, 공개 MDX 컴포넌트
│       ├── app/                공통 화면과 순수 계산 모듈
│       ├── assets/             공통 폰트와 해당 라이선스
│       └── translations/       기본 한국어·일본어 UI 메시지
├── website/                    패키지 기반 검증 사이트
├── tests/                      공개 설정·콘텐츠 처리 검증
├── scripts/                    압축 패키지 생성·독립 설치 검증
├── .github/
│   ├── workflows/              Release 초안 갱신, npm 공개
│   └── scripts/                workflow 전용: 초안 본문, 버전 확인·표기 변경
├── public/                     README의 Dino Ovum 로고
├── docs/                       한국어 설계·개발 문서
├── language/                   영어·한국어·일본어 README
└── pnpm-workspace.yaml

사용자 사이트 (이전 후)
├── documents/                  문서와 문서 번역
├── public/                     사이트 로고·이미지
├── src/
│   ├── css/custom.css          사용자 스타일
│   ├── pages/                 선택: 추가 페이지
│   └── theme/                 선택: 컴포넌트 교체·래퍼
├── docusaurus.config.js
├── package.json
└── pnpm-lock.yaml
```

루트 `public/`은 README 브랜딩용입니다. 사이트 정적 파일은 `website/public/`, 배포하는 공통 폰트는 theme 패키지 내부에 있습니다.

## 사이트 빌드 흐름

```text
사용자가 문서·로고·설정·CSS 작성
  → createDinoConfig(siteConfig, presetOptions)
      → 공통 기본값에 사용자 설정 적용
      → preset 등록
  → preset이 classic 문서 기능·Sass·검색·theme 등록
      → 문서 메타데이터 생성
      → 탐색·최근 업데이트 데이터 생성
      → 선택한 경우 PWA manifest와 서비스 워커 생성
  → theme이 사용자 문서와 데이터를 화면에 표시
  → 정적 빌드 결과를 호스팅에 배포
```

`createDinoConfig`는 중첩 객체를 합치고 배열은 사용자 값으로 교체합니다. 추가 플러그인·테마·preset은 유지합니다. 정확한 옵션과 공개 컴포넌트는 [설정 안내](./configuration.md)에서 관리합니다.

## 패키지 역할과 의존 방향

```text
사용자 사이트
  → @dino-ovum/preset
      → Docusaurus classic·검색·PWA·Sass
      → @dino-ovum/theme
          → 공통 화면·폰트·번역
```

preset은 문서 루트 하나, 자동 사이드바, 검색과 공통 빌드 플러그인을 구성합니다. 검색은 기본 활성화, PWA와 `/updates` 페이지는 기본 비활성화입니다. 사이트 제목·URL·로고·메뉴·언어는 사용자 설정에서 받습니다.

theme은 공통 React 컴포넌트·훅·프로바이더·레이아웃·스타일을 관리합니다. 순수 라우트·날짜·문서 위치 도우미는 theme의 `utils` 공개 경로에 두고 preset에서도 가져옵니다. theme은 preset을 import하지 않습니다.

기본 Docusaurus 컴포넌트를 확장하는 패키지 내부 래퍼는 `@theme-init`을 사용합니다. 사용자 사이트에서 패키지 컴포넌트를 감쌀 때는 `@theme-original`을 사용합니다. 패키지 내부 `@site/src/app` 참조는 없으며 사용자 MDX는 `@theme/DinoOvum/...` 공개 경로를 사용합니다.

## 사용자 파일의 소유권

- 문서·문서 번역·로고·사이트 설정은 사이트가 관리합니다.
- 사용자 CSS는 theme 스타일 뒤에 로드됩니다.
- 기본 UI 번역은 패키지에 있고, 사이트의 같은 번역 키로 재정의할 수 있습니다.
- 사용자 `src/theme/` 교체 파일이 패키지보다 우선합니다. 완전 교체한 부분에는 공통 개선이 적용되지 않을 수 있으므로 가능하면 래퍼를 사용합니다.
- Agentation 등 사이트 개발 도구는 패키지 의존성에 포함하지 않습니다.

## 배포와 업데이트

```text
공통 코드 변경
  → pnpm check 및 pnpm verify:packages
  → theme, preset 순서로 호환 버전 배포
  → 사용자 사이트의 패키지 버전·잠금 파일 변경
  → 사용자 문서를 포함한 사이트 빌드 검증
  → 호스팅 재배포
```

이 저장소에 push하는 것만으로 사용자 사이트가 바뀌지는 않습니다. 패키지는 사용자 문서, 로컬 교체 파일, README, 배포 workflow를 수정하지 않습니다. 기존 템플릿은 최초 한 번 [이전 안내](./migration.md)를 따라 구조를 정리해야 합니다.

지원 대상은 Docusaurus 3.10.1, React 19, Node.js 24.22.1 이상 25 미만입니다. 여러 docs 인스턴스와 다른 Docusaurus 버전은 아직 검증 범위에 포함하지 않습니다.

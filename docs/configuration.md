# 패키지 사용 계약

## 사용자 설정과 패키지 연결

`createDinoConfig(siteConfig, presetOptions)`는 Docusaurus 사이트 설정과 Dino Ovum 옵션을 받아 최종 설정을 만듭니다. 첫 인자는 Docusaurus 설정을 그대로 사용합니다. 두 번째 인자는 공통 기능을 선택합니다.

```js
import {createDinoConfig} from '@dino-ovum/preset/config';

export default createDinoConfig(
  {
    title: 'My documents',
    url: 'https://example.com',
    baseUrl: '/',
    themeConfig: {
      navbar: {logo: {src: 'img/logo.svg'}},
    },
  },
  {
    documents: {path: 'documents', routeBasePath: '/'},
    customCss: './src/css/custom.css',
    updates: true,
    pwa: false,
  },
);
```

## 처리 순서

```text
사용자가 문서·로고·설정·CSS 작성
  → createDinoConfig가 사이트 기본값과 사용자 값 조합
  → preset이 classic 기반 기능과 Dino Ovum theme 등록
  → 문서 플러그인이 문서 메타데이터 생성
  → 공통 플러그인이 탐색·최근 업데이트 데이터 생성
  → theme이 사용자 문서와 데이터를 화면에 표시
```

## 옵션과 우선순위

- `siteConfig`: 사용자 객체 값이 기본값보다 우선합니다. 중첩 객체는 재귀적으로 합치며, 배열은 교체합니다. 따라서 `themeConfig.navbar.items`는 기본 메뉴 전체를 교체합니다.
- `siteConfig.plugins`, `themes`, `presets`: 추가 확장으로 사용합니다. helper가 등록하는 Dino Ovum preset은 유지됩니다. 같은 기본 플러그인을 중복 등록하지 않습니다.
- `documents`: 한 문서 루트의 Docusaurus docs 옵션입니다. 기본 경로는 `documents`, 기본 공개 경로는 `/`입니다. 사이드바는 패키지 안의 자동 생성 설정을 사용하며 사용자 경로로 교체할 수 있습니다.
- `customCss`: 사이트 기준 CSS/SCSS 경로 또는 경로 배열입니다. theme의 기본 스타일 뒤에 적용합니다.
- `search`: 기본 활성화입니다. `false`로 끄거나 검색 플러그인 옵션 객체로 조정합니다. 기본 검색 언어는 사이트 locale을 따르며 지원하지 않는 언어는 `search.language`로 직접 지정합니다.
- `pwa`: 기본 비활성화입니다. `true` 또는 `{manifest, ...pluginOptions}`로 활성화합니다. manifest 기본 이름·설명·언어·시작 경로는 사이트 설정에서 만듭니다. 아이콘 경로는 사이트의 public 디렉터리를 기준으로 지정합니다.
- `updates`: 기본 비활성화입니다. `true`로 `/updates` 페이지와 기본 메뉴 바로가기를 함께 활성화합니다.
- `i18n`: 기본 언어는 영어이며 한국어·일본어를 포함합니다. 문서 번역 위치는 `documents/_translations`입니다. 문서 경로를 변경하면 번역 경로도 그 아래로 기본 설정합니다.
- Agentation은 배포 패키지에 포함하지 않습니다. 개발 도구가 필요한 사이트에서 직접 연결합니다.
- `future.faster`는 기본 `false`입니다. `future.v4`의 스타일·설정 호환 동작은 유지하면서 선택형 Faster 의존성을 필수로 만들지 않습니다.

사이트 `package.json`의 `browserslist`는 [개발 안내](./development.md)의 예제를 사용합니다. 현재 지원 브라우저 범위를 유지하는 빌드 입력입니다.

## PWA와 배포 경로

PWA는 프로덕션 빌드에서 활성화됩니다. 사이트의 `public/img/icon.svg`를 다음처럼 지정할 수 있습니다.

```js
createDinoConfig(
  {title: 'My documents', url: 'https://example.com', baseUrl: '/handbook/'},
  {
    pwa: {
      manifest: {
        short_name: 'Notebook',
        icons: [{src: 'img/icon.svg', sizes: 'any', type: 'image/svg+xml'}],
      },
    },
  },
);
```

manifest 기본 `scope`와 `start_url`, manifest 링크, 상대 아이콘 경로는 현재 언어의 배포 경로를 따릅니다. 위 설정의 한국어 페이지에서는 `/handbook/ko/`를 사용합니다. `https://` 등 외부 아이콘 주소는 그대로 유지합니다. manifest 값은 `pwa.manifest`로 재정의할 수 있습니다.

기본 오프라인 활성화 전략은 `always`이며, 첫 온라인 방문에서 서비스 워커를 설치합니다. 활성화 이후 새로고침하거나 다음 페이지로 이동해 서비스 워커가 제어하는 페이지에서 오프라인 캐시를 사용할 수 있습니다. 다른 전략과 캐시 설정은 `pwa` 객체의 Docusaurus PWA 옵션으로 조정합니다.

## 공개 컴포넌트

사용자 MDX는 다음 경로를 사용합니다. 패키지의 `src/app` 내부 경로는 공개 계약이 아닙니다.

```jsx
import HomeHeading from '@theme/DinoOvum/HomeHeading';
import DocumentTable from '@theme/DinoOvum/DocumentTable';
import Updates from '@theme/DinoOvum/Updates';
```

추가 페이지에는 `@theme/DinoOvum/LibraryLayout`, `@theme/DinoOvum/UpdatesPage`도 사용할 수 있습니다.

공통 route·날짜·문서 위치 계산은 theme의 순수 JavaScript 모듈에서 관리하며, preset은 공개된 `@dino-ovum/theme/utils`를 사용합니다. theme은 preset을 import하지 않습니다.

## 번역과 교체

theme은 한국어·일본어 기본 UI 메시지를 포함합니다. 영어 기본값은 컴포넌트에 있습니다. 사용자 `documents/_translations/<locale>/code.json`의 동일한 키가 기본 UI 메시지보다 우선합니다. 이전을 쉽게 하기 위해 `docnest.*` 번역 키는 유지합니다.

사용자 `src/theme`의 컴포넌트가 패키지보다 우선합니다. 패키지 UI를 감싸려면 사용자 파일에서 `@theme-original`을 사용합니다. 패키지가 기본 Docusaurus theme을 감싸는 부분은 `@theme-init`을 사용합니다.

## 범위

초기 버전은 문서 루트 하나와 현재 Docusaurus 3.10.1 조합을 검증합니다. 여러 문서 인스턴스를 섞는 구성과 다른 Docusaurus 버전은 지원 범위를 넓힐 때 별도로 검증합니다.

참고: [Docusaurus preset](https://docusaurus.io/docs/using-plugins#creating-presets), [theme 계층](https://docusaurus.io/docs/advanced/client).

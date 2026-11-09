# 개발과 패키지 검증

## 개발 환경

Node.js `>=24.22.1 <25`, pnpm `10.5.2`를 사용합니다. 루트와 `website`는 private이고 `packages/preset`, `packages/theme`만 배포 대상입니다.

```sh
nvm use
pnpm install --frozen-lockfile
pnpm start
```

`pnpm start`는 영어 개발 서버를 시작합니다. 한국어나 일본어 개발 서버는 `pnpm --filter @dino-ovum/website start --locale ko` 또는 `--locale ja`로 실행합니다. 프로덕션 빌드는 세 언어를 모두 포함합니다.

```sh
pnpm build
pnpm serve
```

`website/docusaurus.config.js`는 사이트 소유 설정의 예입니다. `website/src/css/custom.css`에서 사용자 CSS의 적용 순서를 확인할 수 있습니다. 공통 `src/app`이나 `src/theme` 복사본은 두지 않습니다.

## 검사 명령

```sh
pnpm lint
pnpm test
pnpm build
pnpm verify:packages
```

앞의 세 명령을 한 번에 실행하려면 `pnpm check`를 사용합니다. 코드 정리는 `pnpm format`으로 실행합니다.

단위 테스트는 설정 병합과 옵션 검증, 번역·에셋 경로, 하위 경로 PWA, 번역된 탐색 데이터, 비공개 문서 제외, 최근 업데이트와 날짜 처리를 검사합니다.

`verify:packages`는 workspace 밖의 임시 디렉터리에서 다음 시나리오를 실행합니다. 의존성 설치를 위해 npm registry에 연결할 수 있어야 합니다.

1. 실제 `.tgz`를 생성하고 배포 파일·라이선스·번역·폰트·일반 버전 의존성을 검사합니다.
2. 두 압축 파일을 새 사이트에 설치합니다. 검증 사이트에는 공통 소스 복사본이 없습니다.
3. 제목, `/handbook/` 배포 경로, 문서, 로고, CSS, 한국어 번역, 컴포넌트 래퍼를 사용자 파일로 준비합니다.
4. 영어·한국어·일본어를 빌드하고 검색 인덱스, 최근 업데이트, PWA manifest·아이콘·서비스 워커, 사용자 변경 결과를 확인합니다.
5. 임시 패키지 복사본을 0.1.1로 올리고 홈에 검증 문구를 추가합니다. 새 압축 파일 설치와 재빌드만으로 문구가 반영되는지 확인합니다.
6. 사용자 파일의 해시가 그대로인지 확인합니다. 저장소의 실제 버전은 0.1.0으로 유지합니다.

검증용 파일은 종료 시 삭제됩니다. 실패한 사이트를 조사할 때는 `DINO_OVUM_KEEP_VERIFICATION=1 pnpm verify:packages`로 임시 경로를 남길 수 있습니다.

## npm 공개 전 다른 사이트에 설치

현재 npm 공개는 하지 않았습니다. 저장소 루트에서 압축 파일을 만듭니다.

```sh
pnpm pack:packages
```

결과는 `artifacts/dino-ovum-theme-0.1.0.tgz`와 `artifacts/dino-ovum-preset-0.1.0.tgz`입니다. preset의 `workspace:*` 의존성은 압축 파일에서 정확한 theme 버전으로 변환됩니다.

다른 사이트에서는 다음 `package.json` 예제의 두 경로를 실제 압축 파일의 절대 경로로 바꿉니다. 아직 공개하지 않은 theme 버전을 registry에서 찾지 않도록 `pnpm.overrides`를 함께 사용합니다.

```json
{
  "name": "my-document-site",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.5.2",
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "serve": "docusaurus serve"
  },
  "dependencies": {
    "@dino-ovum/preset": "file:/absolute/path/dino-ovum-preset-0.1.0.tgz",
    "@docusaurus/core": "3.10.1",
    "@mdx-js/react": "^3.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "browserslist": {
    "production": [">0.5%", "not dead", "not op_mini all"],
    "development": ["last 3 chrome version", "last 3 firefox version", "last 5 safari version"]
  },
  "pnpm": {
    "overrides": {
      "@dino-ovum/theme": "file:/absolute/path/dino-ovum-theme-0.1.0.tgz"
    }
  }
}
```

[설정 안내](./configuration.md)에 따라 `docusaurus.config.js`, `documents/`, `public/`, 사용자 CSS를 준비한 뒤 `pnpm install`과 `pnpm build`를 실행합니다. 처음 구조를 확인할 때는 `website/`의 소스 파일을 복사해 사용할 수 있습니다. `node_modules/`, `build/`, `.docusaurus/`는 복사하지 않습니다.

## 빌드 경계에서 처리하는 사항

사이트의 `browserslist`는 원본 템플릿의 지원 브라우저 범위를 유지합니다. 생략하면 Babel이 오래된 브라우저용으로 async 함수를 변환하면서 Mermaid의 선택 import가 제거되지 않아 빌드가 실패할 수 있습니다. 위 설치 예제와 `website/package.json`의 값을 함께 사용합니다.

Docusaurus 3.10.1은 이름에 `docusaurus`가 없는 의존성의 JSX를 기본 변환 대상에서 제외합니다. theme은 설치된 자신의 소스만 Docusaurus JS loader에 추가합니다. workspace에서는 원래의 loader를 사용합니다. 이 차이를 확인하려면 반드시 압축 패키지 설치 검증을 실행해야 합니다.

pnpm은 선택 peer 의존성 조합에 따라 같은 버전의 Docusaurus 모듈을 여러 경로에 만들 수 있습니다. preset은 React context를 제공하고 소비하는 `theme-common`과 docs client를 classic이 사용하는 동일 경로로 연결합니다.

`future.v4`는 유지하되 `future.faster`는 기본 `false`입니다. 따라서 패키지의 기본 사용에 `@docusaurus/faster`가 필요하지 않습니다. Faster를 사용하려는 사이트는 해당 의존성을 직접 설치하고 사이트 설정에서 켤 수 있습니다.

생성 모듈 호환 플러그인은 Docusaurus 3.10.1의 생성 JS와 서버용 CommonJS 청크 확장자만 조정합니다. Docusaurus를 올릴 때 이 플러그인과 context 연결, 패키지 JSX 변환이 여전히 필요한지 확인합니다.

## 최초 공개 전 확인

npm 범위의 소유권·권한 확인과 실제 공개는 아직 남아 있습니다. 공개할 때는 두 패키지 버전을 함께 관리하고 `check`와 `verify:packages`를 통과한 압축 파일을 사용합니다. theme을 먼저 공개하고, 같은 theme 버전에 의존하는 preset을 공개합니다. 루트와 검증 사이트는 공개하지 않습니다.

공개 후 사용자 사이트는 preset의 registry 버전을 설치하면 됩니다. 로컬 압축 파일용 override는 제거합니다. 실제 공개된 버전을 기준으로 설치 안내를 바꾸고, [이전 안내](./migration.md)에 따라 dino-nest를 별도 전환합니다.

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
5. 임시 패키지 복사본을 현재 버전의 다음 patch 버전으로 올리고 홈에 검증 문구를 추가합니다. 새 압축 파일 설치와 재빌드만으로 문구가 반영되는지 확인합니다.
6. 사용자 파일의 해시가 그대로인지 확인합니다. 저장소의 실제 버전은 바꾸지 않습니다.

1단계의 버전 의존성과 5단계의 업그레이드 버전은 `packages/*/package.json`의 현재 버전에서 계산합니다. 버전을 올려도 검증 스크립트를 고치지 않습니다.

검증용 파일은 종료 시 삭제됩니다. 실패한 사이트를 조사할 때는 `DINO_OVUM_KEEP_VERIFICATION=1 pnpm verify:packages`로 임시 경로를 남길 수 있습니다.

## 공개 전 변경을 다른 사이트에 설치

0.1.0은 npm에 공개되어 있습니다. 공개하지 않은 변경을 다른 사이트에서 확인할 때는 저장소 루트에서 압축 파일을 만듭니다.

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

## 공개 절차

0.1.0은 npm org `dino-ovum`으로 대화형 터미널에서 직접 공개했습니다. 0.1.1부터는 GitHub Release 초안에 변경을 모아 두고, 초안을 공개하면 GitHub Actions가 npm에 배포합니다. 버전은 npm 공개가 성공했을 때만 올라갑니다. 커밋할 때마다 버전이 생기지 않습니다.

### 흐름

```text
main push #1 ─▶ release-draft.yml ─▶ Release 초안 v0.1.1 생성        (변경 1개)
main push #2 ─▶ release-draft.yml ─▶ 같은 초안의 변경 목록 갱신       (변경 2개)
     ⋮
Releases에서 초안 확인 → minor·major면 태그 이름 수정 → "Publish release"
     │
     ▼
publish.yml (release published)
 ├ 1. 태그 이름에서 버전 읽기                 v0.1.1 → 0.1.1
 ├ 2. 버전 표기 변경                          실행 환경 안에서만 바꾸고 아직 커밋하지 않음
 ├ 3. pnpm check, pnpm verify:packages
 ├ 4. pnpm pack:packages → npm publish theme → npm publish preset
 │      └ 실패하면 Release를 초안으로 되돌리고 태그 삭제. main의 버전은 그대로
 └ 5. 공개 성공 후                            커밋 `chore: release v0.1.1` → main
                                              태그 v0.1.1을 이 커밋으로 이동
main push #3 ─▶ release-draft.yml ─▶ 새 초안 v0.1.2 생성
```

### 초안 (`.github/workflows/release-draft.yml`)

- `main`에 push될 때 실행합니다. 초안 본문은 `.github/scripts/draft.js`가 만듭니다. 초안은 항상 하나만 유지합니다.
- 초안이 없으면 마지막으로 공개한 Release의 다음 patch 버전으로 만듭니다.
- 본문의 `<!-- dino-ovum:changes:start -->`와 `<!-- dino-ovum:changes:end -->` 사이만 갱신합니다. 이 표시는 GitHub 화면에 보이지 않습니다. 두 패키지의 버전 표와 마지막 공개 태그 이후의 커밋 목록이 들어가며, `chore: release` 커밋은 뺍니다. 표시 밖에 직접 적은 내용은 유지합니다.
- 직접 고친 태그 이름(예: `v0.2.0`)은 덮어쓰지 않고, 버전 표도 그 이름을 따릅니다.

### 버전 고르기

초안은 patch로 만들어집니다. minor나 major로 공개할 때는 Publish 전에 초안을 편집해 태그 이름을 바꿉니다.

| 버전 | 초안 태그 이름 (0.1.0 다음) | 용도 | 공개하면서 할 일 |
| --- | --- | --- | --- |
| patch (기본) | `v0.1.1` 그대로 | 수정, 작은 개선 | 없음. `^0.1.0` 사이트는 `pnpm update`로 받습니다. |
| minor | `v0.2.0`으로 수정 | 기능 추가 | 초안 본문에 올리는 방법(`@dino-ovum/preset@^0.2.0`)과 새 기능을 적습니다. 공개 후 dino-nest 의존성을 올립니다. |
| major | `v1.0.0`으로 수정 | 사용자가 사이트를 고쳐야 하는 변경 | 공개 전에 [이전 안내](./migration.md)에 바뀐 점과 옮기는 방법을 적습니다. |

0.x에서 `^0.1.0`은 0.2.0을 받지 않으므로 patch만 사용자 사이트에 자동 반영됩니다. 1.0.0 이후에는 `^1.0.0`이 minor와 patch를 모두 받습니다.

### 공개 (`.github/workflows/publish.yml`)

- 초안에서 "Publish release"를 누를 때 실행합니다.
- 태그 이름은 `v주.부.수` 형식이고 현재 `package.json`의 버전보다 커야 합니다. 아니면 npm 공개 전에 실패하고 초안으로 되돌립니다.
- 버전 표기: `.github/scripts/version.js`가 루트·`packages/preset`·`packages/theme`·`website`의 `package.json`과 `website/docusaurus.config.js`의 `customFields.version`을 같은 버전으로 바꿉니다.
- 공개 순서: theme을 먼저 공개하고, 같은 theme 버전에 의존하는 preset을 공개합니다. 루트와 검증 사이트는 공개하지 않습니다.
- 다시 공개: npm에 이미 있는 패키지 버전은 건너뜁니다. theme 공개 후 preset에서 실패하면 초안으로 돌아오므로, 원인을 고치고 다시 Publish release를 눌러 preset부터 이어서 공개합니다. theme을 고쳐야 하는 실패라면 같은 버전을 다시 공개할 수 없으므로 초안 태그 이름을 다음 patch로 올립니다.
- 공개 중에는 `main`에 push하지 않습니다. 버전 커밋을 push할 때 `main`이 앞서 있으면 npm 공개 후에 workflow가 실패합니다. 이때 npm에는 이미 공개되어 있으므로 Release는 공개 상태로 남습니다. `node .github/scripts/version.js set <버전>`으로 만든 버전 커밋을 `main`에 직접 올리고 태그를 그 커밋으로 옮깁니다.
- 버전 커밋은 workflow 권한으로 push되어 `release-draft.yml`을 실행하지 않습니다. 다음 초안은 다음 push 때 생깁니다.

### npm 인증

npm Trusted Publishing(OIDC)을 사용합니다. GitHub Actions가 실행마다 짧은 인증을 npm에서 직접 받으므로 저장소에 npm 토큰을 두지 않고, 계정의 2FA 설정도 그대로 유지합니다.

- workflow 권한: `id-token: write`(npm 인증), `contents: write`(버전 커밋·태그·Release).
- npm CLI 11.5.1 이상이 필요합니다. `.nvmrc`의 Node.js 24.22.1에는 npm 11.19.1이 포함됩니다.
- pnpm 10의 publish가 Trusted Publishing을 지원하는지는 확인하지 못했습니다. 따라서 `pnpm pack`으로 `workspace:*`를 실제 버전으로 바꾼 압축 파일을 만들고 `npm publish`로 공개합니다.

npmjs.com에서 두 패키지마다 한 번 등록합니다. 패키지 owner만 등록할 수 있습니다. 등록은 패키지에 저장되므로 owner 계정을 이전해도 다시 하지 않습니다.

| 항목 | 값 |
| --- | --- |
| 위치 | 패키지 Settings → Trusted Publisher → GitHub Actions |
| Organization or user | `4BFC` |
| Repository | `dino-ovum` |
| Workflow filename | `publish.yml` |
| Environment | 비움 |

`main`에 보호 규칙을 추가하면 workflow의 버전 커밋 push가 막힐 수 있습니다. 보호 규칙을 추가할 때 이 workflow의 push 허용을 함께 정합니다.

### 사용자 사이트

사용자 사이트는 preset의 registry 버전을 설치합니다. 로컬 압축 파일용 override는 제거합니다. dino-nest는 [이전 안내](./migration.md)에 따라 별도로 전환합니다.

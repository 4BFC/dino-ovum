# dino-nest의 패키지 구조 이전

이 문서는 기존 사이트를 Dino Ovum 패키지 구조로 옮기는 절차입니다. 현재 dino-nest 저장소 자체는 변경하지 않았으며 npm 최초 배포도 아직 하지 않았습니다. 공개 전에는 [개발 안내](./development.md)의 로컬 압축 파일 설치로 먼저 검증합니다.

## 이전 시나리오

```text
기존 사이트와 사용자 변경 확인
  → 사용자 문서·로고·설정·CSS·추가 페이지 보존
  → preset 패키지 설치
  → createDinoConfig로 공통 기본값 연결
  → MDX import를 공개 컴포넌트로 변경
  → 패키지와 중복되는 로컬 공통 코드 제거
  → 언어별 빌드·화면·배포 경로 확인
  → 변경 검토 후 사이트 배포
```

먼저 별도 브랜치에서 진행하고, 기존 `src/app`·`src/theme`에 사용자 수정이 있는지 확인합니다. 디렉터리를 통째로 지우기 전에 공통 구현과 사용자 변경을 구분해야 합니다.

## 사이트에 남길 파일

- `documents/`와 문서 번역, 사용자 `code.json`.
- `public/`의 사이트 로고와 이미지.
- 사이트 이름·URL·baseUrl·메뉴·언어·호스팅 설정.
- `src/pages/`의 사이트 전용 페이지.
- 사용자 스타일과 의도적으로 교체한 컴포넌트.

Pretendard 공통 폰트와 기본 UI 메시지는 theme이 제공합니다. 기존 번역 키 `docnest.*`는 유지되므로 사용자가 수정한 메시지를 계속 재정의할 수 있습니다. 패키지에서 제공하는 기본 번역만 있는 로컬 항목을 남겨두면 이후 번역 개선을 가릴 수 있습니다.

## 설정과 import 변경

기존 공통 플러그인·classic·검색·Sass·PWA 등록을 `createDinoConfig`로 대체합니다. 같은 플러그인을 별도로 중복 등록하지 않습니다. 사이트 고유 플러그인과 메뉴는 첫 인자에 유지하고 기능 선택은 두 번째 인자에 넣습니다. 전체 예제는 [설정 안내](./configuration.md)를 따릅니다.

홈 제목·문서 표·공통 레이아웃·최근 업데이트는 공개 경로를 사용합니다.

```jsx
import HomeHeading from '@theme/DinoOvum/HomeHeading';
import DocumentTable from '@theme/DinoOvum/DocumentTable';
import LibraryLayout from '@theme/DinoOvum/LibraryLayout';
import Updates from '@theme/DinoOvum/Updates';
```

기존 `/updates` 공통 페이지는 `updates: true`로 대체할 수 있습니다. 이때 동일 경로의 로컬 페이지는 제거해야 합니다. 사이트 전용 페이지를 유지하려면 `updates: false`로 두고 필요한 공개 컴포넌트를 사용합니다.

공통 `src/app`과 패키지가 제공하는 로컬 `src/theme` 복사본은 import 변경과 사용자 수정 이관을 마친 뒤 제거합니다. 사용자 CSS는 별도 파일로 옮겨 `customCss`로 등록합니다. 공통 컴포넌트 일부를 확장해야 한다면 해당 경로에만 래퍼를 둡니다.

```jsx
// src/theme/DinoOvum/HomeHeading.jsx
import OriginalHomeHeading from '@theme-original/DinoOvum/HomeHeading';

export default function HomeHeading() {
  return (
    <section>
      <OriginalHomeHeading />
      <p>내 사이트의 안내 문구</p>
    </section>
  );
}
```

## 확인과 이후 업데이트

사용자 문서, 언어 전환, 검색 결과, 최근 업데이트 링크, 모바일 탐색, 밝은/어두운 테마를 확인합니다. 하위 경로로 배포한다면 실제 `baseUrl`로 빌드하고 이미지·manifest·서비스 워커 경로도 확인합니다. 오프라인 기능은 개발 서버가 아닌 프로덕션 미리보기에서 확인합니다.

이후 공통 변경은 preset 패키지 버전과 잠금 파일을 갱신하고 사이트를 다시 빌드·배포해 받습니다. preset이 호환 theme 버전을 의존하므로 보통 preset만 직접 관리하면 됩니다. 사용자가 완전히 교체한 컴포넌트에는 릴리스별 수동 비교가 필요할 수 있습니다.

Dependabot 등 의존성 업데이트 PR 도구와 호스팅 빌드 연결은 템플릿 전환 단계에서 설정합니다. README·배포 workflow·사용자 설정 파일의 변경은 패키지 설치만으로 자동 전달되지 않습니다.

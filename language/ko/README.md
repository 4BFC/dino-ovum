<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../public/img/logo.png">
    <source media="(prefers-color-scheme: light)" srcset="../../public/img/logo.png">
    <img alt="" src="../../public/img/logo.png" width="96" height="96" align="bottom">
  </picture>&ensp;dino-ovum
</h1>

dino-nest를 위한 공통 Docusaurus preset과 theme입니다.

[![Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg?style=flat-square)](../../LICENSE)
[![Standard Readme](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

문서와 브랜딩, 사이트 설정은 내 프로젝트에서 관리하세요. Dino Ovum은 preset과 theme
패키지를 통해 dino-nest의 공통 기능과 디자인을 제공합니다.

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="../eng/README.md"><img src="https://img.shields.io/badge/English-555555?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="README.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-0969DA?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="../jp/README.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-555555?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

설계와 구현 문서는 `docs/`에서 한국어로 관리합니다.

## 목차

- [스펙](#스펙)
- [설치](#설치)
- [사용법](#사용법)
- [주요 기능](#주요-기능)
- [관리자](#관리자)
- [기여](#기여)
- [라이선스](#라이선스)

## 스펙

Dino Ovum의 패키지 구성과 역할입니다.

| 구성 | 패키지 | 설명 |
| --- | --- | --- |
| ![Dino Ovum Preset](https://img.shields.io/badge/Dino_Ovum-preset-2e8555?style=flat-square) | `@dino-ovum/preset` | 공통 사이트 설정, 문서·사이드바 구성, 검색·PWA·탐색·최근 업데이트 플러그인 |
| ![Dino Ovum Theme](https://img.shields.io/badge/Dino_Ovum-theme-2e8555?style=flat-square) | `@dino-ovum/theme` | 공통 UI·컴포넌트·레이아웃·스타일·폰트·기본 UI 번역 |

## 설치

현재 저장소에는 문서와 프로젝트 브랜딩이 있습니다. 패키지 분리와 배포는 아직 완료하지 않았으므로 설치 명령은 제공하지 않습니다.

작업 단계와 검증 기준은 [구현 계획](../../docs/implementation-plan.md)을 참고하세요.

## 사용법

나만의 문서 사이트를 만들 때는 [dino-nest](https://github.com/4BFC/dino-nest)를 템플릿으로 사용합니다. Dino Ovum은 그 공통 패키지를 개발하고 배포하는 저장소입니다.

목표 관계는 다음과 같습니다.

```text
dino-nest
  → @dino-ovum/preset
      → @dino-ovum/theme
```

문서·로고·사이트 설정·사용자 CSS는 사용자 프로젝트에 남깁니다. 공통 개선은 패키지 업데이트, 빌드 검사, 재배포를 거쳐 사이트에 반영합니다.

저장소 경계와 커스텀 방식은 [아키텍처 문서](../../docs/architecture.md)를 참고하세요.

## 주요 기능

패키지는 다음 역할로 설계합니다.

- 문서·검색·PWA·사이드바의 공통 구성.
- 탐색과 최근 업데이트 데이터 생성.
- 공통 레이아웃·컴포넌트·스타일·폰트.
- 기본 UI 번역과 사용자 커스텀 지원.

첫 구현 완료 지점은 실제 배포 형태의 패키지를 사용하는 검증용 사이트입니다. 현재 진행 상태는 [구현 계획](../../docs/implementation-plan.md)에 정리합니다.

## 관리자

[4BFC](https://github.com/4BFC)

## 기여

질문과 버그 제보는 [GitHub Issues](https://github.com/4BFC/dino-ovum/issues)에 남겨 주세요.
패키지 변경을 제안하기 전에 [아키텍처](../../docs/architecture.md)와 [구현 계획](../../docs/implementation-plan.md)을 확인하세요.

## 라이선스

[Unlicense](../../LICENSE)를 적용합니다.
외부 에셋과 의존성은 각각의 라이선스와 고지를 유지합니다.

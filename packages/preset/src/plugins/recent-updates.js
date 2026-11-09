/**
 * 문서 frontmatter 의 날짜를 모아 /updates 페이지로 넘긴다.
 *
 * 경로를 직접 계산하지 않고 docs 플러그인이 이미 확정한 permalink 를 그대로 쓴다.
 * 번호 접두사 제거 규칙(`07-logout` → `logout`)이 인스턴스마다 다르게 걸려서,
 * 손으로 URL 을 만들면 조용히 404 가 되기 때문이다.
 *
 * 날짜는 git log 가 아니라 frontmatter 에서 읽는다 - Vercel 이 shallow clone 이라
 * 빌드 환경에서 커밋 이력을 신뢰할 수 없다.
 */

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';

export default function recentUpdatesPlugin(context, options = {}) {
  const {documentDates, labels = {}} = options;
  if (typeof documentDates !== 'function') {
    throw new TypeError('Recent updates requires a documentDates option.');
  }

  return {
    name: 'recent-updates',

    contentLoaded({actions}) {
      if (options.page) {
        actions.addRoute({
          path: `${context.baseUrl}updates`,
          component: '@theme/DinoOvum/UpdatesPage',
          exact: true,
        });
      }
    },

    // 다른 플러그인의 결과까지 다 모인 뒤에 도는 단계여야 permalink 를 읽을 수 있다.
    async allContentLoaded({allContent, actions}) {
      const instances = allContent[DOCS_PLUGIN] || {};
      const entries = [];

      for (const [instanceId, data] of Object.entries(instances)) {
        for (const version of data.loadedVersions || []) {
          for (const doc of version.docs || []) {
            if (doc.draft || doc.unlisted) continue;

            const {created, updated} = documentDates(doc.frontMatter);
            if (!created && !updated) continue; // 날짜가 없으면 줄 세울 기준이 없다

            entries.push({
              title: doc.title,
              url: doc.permalink,
              instance: labels[instanceId] || instanceId,
              created,
              updated,
              // 만든 날과 고친 날이 같으면 아직 한 번도 안 고친 새 문서다
              isNew: Boolean(created) && created === updated,
            });
          }
        }
      }

      entries.sort((a, b) =>
        String(b.updated || b.created).localeCompare(String(a.updated || a.created)),
      );

      actions.setGlobalData({entries});
    },
  };
}

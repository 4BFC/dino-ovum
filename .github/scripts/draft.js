// Release draft body for .github/workflows/release-draft.yml.
// Called from actions/github-script with its github, context, core, and exec objects.
export const START_MARKER = '<!-- dino-ovum:changes:start -->';
export const END_MARKER = '<!-- dino-ovum:changes:end -->';

export function parseTag(tag) {
  return /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag)?.slice(1).map(Number);
}

export function compareTags(left, right) {
  const [leftParts, rightParts] = [parseTag(left), parseTag(right)];
  return (
    leftParts
      .map((part, index) => part - rightParts[index])
      .find((difference) => difference !== 0) ?? 0
  );
}

export function changesSection({version, latestTag, changes}) {
  return [
    START_MARKER,
    '| 패키지 | 버전 |',
    '| --- | --- |',
    `| [\`@dino-ovum/preset\`](https://www.npmjs.com/package/@dino-ovum/preset) | ${version} |`,
    `| [\`@dino-ovum/theme\`](https://www.npmjs.com/package/@dino-ovum/theme) | ${version} |`,
    '',
    `## ${latestTag} 이후 변경`,
    '',
    ...(changes.length > 0 ? changes : ['- 아직 변경이 없습니다.']),
    END_MARKER,
  ].join('\n');
}

// Only the marked section is rewritten. Notes written around it stay.
export function replaceSection(body, section) {
  const startIndex = body.indexOf(START_MARKER);
  const endIndex = body.indexOf(END_MARKER);
  if (startIndex !== -1 && endIndex > startIndex)
    return body.slice(0, startIndex) + section + body.slice(endIndex + END_MARKER.length);
  return [section, body].filter(Boolean).join('\n\n');
}

export default async function updateReleaseDraft({github, context, core, exec}) {
  const {owner, repo} = context.repo;
  const releases = await github.paginate(github.rest.repos.listReleases, {
    owner,
    repo,
    per_page: 100,
  });
  const publishedTags = releases
    .filter((release) => !release.draft && !release.prerelease && parseTag(release.tag_name))
    .map((release) => release.tag_name)
    .sort((left, right) => compareTags(right, left));
  if (publishedTags.length === 0) {
    core.setFailed('No published release to start the draft from.');
    return;
  }
  const latestTag = publishedTags[0];
  const [major, minor, patch] = parseTag(latestTag);
  const nextPatchTag = `v${major}.${minor}.${patch + 1}`;

  const drafts = releases.filter((release) => release.draft);
  if (drafts.length > 1)
    core.warning(`Found ${drafts.length} drafts. Updating only the newest one.`);
  const draft = drafts[0];

  // Keep a newer version typed into the draft for a minor or major release.
  let tag = nextPatchTag;
  if (draft && parseTag(draft.tag_name) && compareTags(draft.tag_name, latestTag) > 0) {
    tag = draft.tag_name;
  } else if (draft) {
    core.warning(
      `Draft tag ${draft.tag_name} is not newer than ${latestTag}. Using ${nextPatchTag}.`,
    );
  }

  const {stdout} = await exec.getExecOutput(
    'git',
    ['log', '--no-merges', '--format=%h %s', `${latestTag}..HEAD`],
    {silent: true},
  );
  const changes = stdout
    .split('\n')
    .filter((line) => line && !/^\S+ chore: release v/.test(line))
    .map((line) => `- ${line}`);
  const body = replaceSection(
    draft?.body ?? '',
    changesSection({version: tag.slice(1), latestTag, changes}),
  );

  if (draft) {
    const name = !draft.name || draft.name === draft.tag_name ? tag : draft.name;
    await github.rest.repos.updateRelease({
      owner,
      repo,
      release_id: draft.id,
      tag_name: tag,
      name,
      body,
      draft: true,
    });
    core.notice(`Updated draft ${tag} with ${changes.length} changes since ${latestTag}.`);
  } else {
    await github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      body,
      draft: true,
      target_commitish: 'main',
    });
    core.notice(`Created draft ${tag} with ${changes.length} changes since ${latestTag}.`);
  }
}

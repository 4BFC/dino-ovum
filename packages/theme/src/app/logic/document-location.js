// Interpret paths relative to the starter's document root.
export function documentLocation(source, sourceDirName) {
  const relativeSource =
    sourceDirName === undefined
      ? source.replace(/^@site\/documents\//, '')
      : [sourceDirName === '.' ? '' : sourceDirName, source.split('/').at(-1)]
          .filter(Boolean)
          .join('/');
  const segments = relativeSource.split('/');
  const filename = segments.pop();
  const directory = segments.join('/');
  const isIndex = /^(index|home)\.(md|mdx)$/.test(filename);
  return {
    segments,
    directory,
    isIndex,
    isDocumentCategory: segments.length > 0 && isIndex,
  };
}

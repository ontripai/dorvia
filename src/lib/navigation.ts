export function getNavPath(targetPath: string, currentPathname: string): string {
  // 1. External URLs, mailto, tel, anchors remain untouched
  if (
    targetPath.startsWith('http') ||
    targetPath.startsWith('mailto:') ||
    targetPath.startsWith('tel:') ||
    targetPath.startsWith('#')
  ) {
    return targetPath;
  }

  // 2. Parse URL to separate path from query/hash
  let urlObj;
  try {
    urlObj = new URL(targetPath, 'http://localhost');
  } catch {
    return targetPath; // fallback for invalid URLs
  }
  
  let barePath = urlObj.pathname;
  if (barePath === 'home' || barePath === '/home') {
    barePath = '/';
  } else if (!barePath.startsWith('/')) {
    barePath = '/' + barePath;
  }

  // 3. Determine current locale prefix
  const isEn = currentPathname.startsWith('/en/') || currentPathname === '/en';
  const prefix = isEn ? '/en' : '/fa';

  // 4. Avoid double-prefixing
  if (barePath.startsWith('/fa/') || barePath === '/fa' || 
      barePath.startsWith('/en/') || barePath === '/en') {
    return targetPath;
  }

  // 5. Construct new path preserving search and hash
  const newPath = barePath === '/' ? prefix : `${prefix}${barePath}`;
  return newPath + urlObj.search + urlObj.hash;
}

export function getNavPath(targetPath: string, currentPathname: string): string {
  // 1. Normalize targetPath to have a leading slash
  const barePath = targetPath === 'home' ? '/' : (targetPath.startsWith('/') ? targetPath : `/${targetPath}`);
  
  // 2. Identify if the destination is one of our three migrated routes
  const isMigratedRoute = barePath === '/' || barePath === '/about' || barePath === '/contact';
  
  if (isMigratedRoute) {
    // 3. Check localized context of the CURRENT pathname
    // Next.js standardizes trailing slashes, but we check both safely
    if (currentPathname.startsWith('/en/') || currentPathname === '/en') {
      return barePath === '/' ? '/en' : `/en${barePath}`;
    }
    if (currentPathname.startsWith('/fa/') || currentPathname === '/fa') {
      return barePath === '/' ? '/fa' : `/fa${barePath}`;
    }
    // 4. Legacy context (no /fa or /en prefix in current URL)
    return barePath;
  }
  
  // 5. Unmigrated destinations (e.g. /study, /work) remain exactly as they were
  return barePath;
}

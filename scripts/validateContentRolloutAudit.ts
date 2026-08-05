import fs from 'fs';
import path from 'path';
import { ROUTE_REGISTRY } from '../src/lib/routeRegistry';

const AUDIT_FILE = path.join(process.cwd(), 'docs/content-rollout/route-audit.json');

function runValidation() {
  if (!fs.existsSync(AUDIT_FILE)) {
    console.error('Audit file not found at', AUDIT_FILE);
    process.exit(1);
  }

  const auditData = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  const registryKeys = Object.values(ROUTE_REGISTRY).map(r => r.canonical);

  let errors: string[] = [];

  // Check 1: Audit count equals ROUTE_REGISTRY count
  if (auditData.length !== registryKeys.length) {
    errors.push(`Audit count (${auditData.length}) does not match ROUTE_REGISTRY count (${registryKeys.length})`);
  }

  // Check 2: No alias included as canonical
  const aliases = Object.values(ROUTE_REGISTRY).flatMap(r => r.aliases);
  
  const canonicalSet = new Set<string>();

  for (const entry of auditData) {
    if (aliases.includes(entry.canonical)) {
      errors.push(`Alias included as canonical: ${entry.canonical}`);
    }

    // Check 3: Duplicate canonical routes
    if (canonicalSet.has(entry.canonical)) {
      errors.push(`Duplicate canonical route: ${entry.canonical}`);
    }
    canonicalSet.add(entry.canonical);

    // Check 4: Missing target page type
    if (!entry.targetPageType) {
      errors.push(`Route has no target page type: ${entry.canonical}`);
    }

    // Check 5: Missing priority
    if (!entry.priority) {
      errors.push(`Route has no priority: ${entry.canonical}`);
    }

    // Check 6: Missing rollout Wave
    if (!entry.rolloutWave) {
      errors.push(`Route has no rollout Wave: ${entry.canonical}`);
    }

    // Check 7: HIGH or CRITICAL route missing authority plan
    if ((entry.riskLevel === 'HIGH' || entry.riskLevel === 'CRITICAL') && !entry.primaryAuthority) {
      errors.push(`HIGH/CRITICAL route has no authority plan: ${entry.canonical}`);
    }

    // Check 8: Missing language status
    if (!entry.currentLanguageSupport) {
      errors.push(`Route has no language status: ${entry.canonical}`);
    }


    // Check 11: Extra fields missing
    if (!entry.riskLevel) errors.push('Route has no risk: ' + entry.canonical);
    if (!entry.sourceStatus) errors.push('Route has no source status: ' + entry.canonical);
    if (!entry.contentQuality) errors.push('Route has no content quality: ' + entry.canonical);

    // Check 9: Unknown page type or status
    const validTypes = ['OPERATIONAL_GUIDE', 'DECISION_HUB', 'REFERENCE_GUIDE', 'DIRECTORY_OR_INDEX', 'TRANSACTIONAL_OR_FORM', 'LEGAL_PAGE', 'INSTITUTIONAL_PAGE', 'ARTICLE_OR_EDITORIAL_INDEX', 'UTILITY_PAGE', 'ARCHIVE_OR_DEPRECATE_CANDIDATE'];
    if (!validTypes.includes(entry.targetPageType)) {
      errors.push(`Unknown page type: ${entry.targetPageType} on ${entry.canonical}`);
    }
  }


  // Check 12: Specific route checks
  if (canonicalSet.has('/legal')) errors.push('/legal appears as a canonical Audit record');
  if (!canonicalSet.has('/romania/cities')) errors.push('/romania/cities is missing');
  if (canonicalSet.has('/cities')) errors.push('/cities appears as canonical');

  // Check 13: Static/Dynamic counts
  const staticCount = auditData.filter((r: any) => !r.isDynamic).length;
  const dynamicCount = auditData.filter((r: any) => r.isDynamic).length;
  if (staticCount !== 15) errors.push(`Static canonical count is not 15 (got ${staticCount})`);
  if (dynamicCount !== 51) errors.push(`Dynamic canonical count is not 51 (got ${dynamicCount})`);

  // Check 14: Classification totals do not equal 66
  if (auditData.length !== 66) errors.push(`Classification totals do not equal 66 (got ${auditData.length})`);
  
  // Check 15: Sitemap mismatch
  const sitemapKeys = Object.values(ROUTE_REGISTRY).filter(r => r.inSitemap).map(r => r.canonical);
  if (auditData.length !== sitemapKeys.length) {
    errors.push(`Audit count (${auditData.length}) differs from Sitemap count (${sitemapKeys.length})`);
  }

  // Check 10: Missing from audit
  for (const route of registryKeys) {
    if (!canonicalSet.has(route)) {
      errors.push(`Canonical route missing from audit: ${route}`);
    }
  }


  // Markdown checks
  const inventoryContent = fs.readFileSync(path.join(process.cwd(), 'docs/content-rollout/route-inventory.md'), 'utf8');
  const countsContent = fs.readFileSync(path.join(process.cwd(), 'docs/content-rollout/route-and-build-counts.md'), 'utf8');

  const inventoryLines = inventoryContent.split('\n');
  const legalInventoryLine = inventoryLines.find(l => l.startsWith('- **/legal**') || l.startsWith('- /legal '));
  if (legalInventoryLine) errors.push('route-inventory.md contains a canonical /legal entry');
  
  if (!inventoryContent.includes('/romania/cities')) errors.push('route-inventory.md omits /romania/cities');

  if (countsContent.includes('/legal/[slug]`: 4')) errors.push('route-and-build-counts.md states /legal/[slug] = 4');
  if (countsContent.includes('dynamic canonical = 52') || countsContent.includes('52 Dynamic Canonical')) errors.push('route-and-build-counts.md states dynamic canonical = 52');
  if (countsContent.includes('/romania/cities is noncanonical') || countsContent.includes('/romania/cities are physical static pages but are NOT included in `ROUTE_REGISTRY`')) errors.push('route-and-build-counts.md states /romania/cities is noncanonical');

  if (!countsContent.includes('15 Static Canonical + 51 Dynamic Canonical = 66 Canonical Routes')) errors.push('documented equation differs from 15 + 51 = 66 in route-and-build-counts.md');

  if (errors.length > 0) {
    console.error('Content Rollout Audit Validation Failed:');
    errors.forEach(e => console.error('- ' + e));
    process.exit(1);
  }

  console.log('✅ Content Rollout Audit Validation Passed.');
}

runValidation();

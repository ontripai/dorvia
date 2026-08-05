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

    // Check 9: Unknown page type or status
    const validTypes = ['OPERATIONAL_GUIDE', 'DECISION_HUB', 'REFERENCE_GUIDE', 'DIRECTORY_OR_INDEX', 'TRANSACTIONAL_OR_FORM', 'LEGAL_PAGE', 'INSTITUTIONAL_PAGE', 'ARTICLE_OR_EDITORIAL_INDEX', 'UTILITY_PAGE', 'ARCHIVE_OR_DEPRECATE_CANDIDATE'];
    if (!validTypes.includes(entry.targetPageType)) {
      errors.push(`Unknown page type: ${entry.targetPageType} on ${entry.canonical}`);
    }
  }

  // Check 10: Missing from audit
  for (const route of registryKeys) {
    if (!canonicalSet.has(route)) {
      errors.push(`Canonical route missing from audit: ${route}`);
    }
  }

  if (errors.length > 0) {
    console.error('Content Rollout Audit Validation Failed:');
    errors.forEach(e => console.error('- ' + e));
    process.exit(1);
  }

  console.log('✅ Content Rollout Audit Validation Passed.');
}

runValidation();

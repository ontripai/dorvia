const fs = require('fs');

const pageMetaSource = fs.readFileSync('src/lib/pageMeta.ts', 'utf8');

// Quick and dirty parser for PAGE_META
let pageMetaObjStr = pageMetaSource.substring(pageMetaSource.indexOf('const PAGE_META') !== -1 ? pageMetaSource.indexOf('const PAGE_META') : pageMetaSource.indexOf('PAGE_META: Record<string, PageMetaItem> = {'));
pageMetaObjStr = pageMetaObjStr.substring(pageMetaObjStr.indexOf('{'));
pageMetaObjStr = pageMetaObjStr.substring(0, pageMetaObjStr.lastIndexOf('};') + 1);

// We can execute this as a javascript snippet
const PAGE_META = eval('(' + pageMetaObjStr + ')');

const canonicals = {
    '/work/finding-job': ['/work/find-job'],
    '/work/work-permit': ['/work/permit'],
    '/work/work-visa': ['/work/visa'],
    '/work/employment-contract': ['/work/contract'],
    '/work/taxes-salaries': ['/work/tax'],
    '/work/insurance': [],
    '/needs/health': ['/needs/healthcare'],
    '/needs/telecom': ['/needs/sim-internet'],
    '/romania/culture-and-arts': ['/romania/culture'],
    '/romania/cities': ['/cities'], 
    '/legal/privacy': [],
    '/legal/terms': [],
    '/legal/disclaimer': [],
    '/start-here/planning-to-come': ['/start-here/arriving-soon', '/start-here/pre-departure-checklist'],
    '/start-here/newly-arrived': ['/start-here/just-arrived', '/start-here/first-three-days'],
    '/start-here/settling-in': ['/start-here/living-here', '/start-here/first-month'],
    '/start-here/long-term-stay': [],
    '/start-here/citizenship-goal': [],
};

const aliasMap = {};
for (const [canon, aliases] of Object.entries(canonicals)) {
    aliases.forEach(a => {
        aliasMap[a.replace(/^\//, '')] = canon;
    });
}

const canonToAlias = {};
for (const [canon, aliases] of Object.entries(canonicals)) {
    canonToAlias[canon.replace(/^\//, '')] = aliases;
}

let finalCode = `export interface RouteConfig {
  canonical: string;
  aliases: string[];
  parentHub: string | null;
  titleFa: string;
  titleEn: string;
  parentTitleFa?: string;
  parentTitleEn?: string;
  indexable: boolean;
  inSitemap: boolean;
  pageType: 'hub' | 'content' | 'legal' | 'admin' | 'api' | 'special';
}

export const ROUTE_REGISTRY: Record<string, RouteConfig> = {
`;

for (const [key, meta] of Object.entries(PAGE_META)) {
    if (aliasMap[key]) continue; 
    
    let canonical = '/' + key;
    let aliases = canonToAlias[canonical] || [];
    let pageType = 'content';
    let indexable = true;
    let inSitemap = true;

    if (!meta.parentPath) {
        pageType = 'hub';
    } else if (key.startsWith('legal/')) {
        pageType = 'legal';
    }

    if (key === 'evaluation') {
        indexable = false;
        inSitemap = false;
        pageType = 'special';
    } else if (key === 'admin/comments' || key.startsWith('admin')) {
        indexable = false;
        inSitemap = false;
        pageType = 'admin';
    } else if (key === 'cities') {
        continue;
    }

    if (key === 'romania/cities') {
        aliases = ['/cities'];
    }

    finalCode += `  '${key}': {
    canonical: '${canonical}',
    aliases: ${JSON.stringify(aliases)},
    parentHub: ${meta.parentPath ? "'" + meta.parentPath + "'" : 'null'},
    titleFa: '${meta.titleFa.replace(/'/g, "\\'")}',
    titleEn: '${meta.titleEn.replace(/'/g, "\\'")}',
    ${meta.parentTitleFa ? `parentTitleFa: '${meta.parentTitleFa.replace(/'/g, "\\'")}',` : ''}
    ${meta.parentTitleEn ? `parentTitleEn: '${meta.parentTitleEn.replace(/'/g, "\\'")}',` : ''}
    indexable: ${indexable},
    inSitemap: ${inSitemap},
    pageType: '${pageType}'
  },\n`;
}

finalCode += `};
`;

fs.writeFileSync('src/lib/routeRegistry.ts', finalCode, 'utf8');

const newPageMeta = `import { ROUTE_REGISTRY } from './routeRegistry';

export interface PageMetaItem {
  titleFa: string;
  titleEn: string;
  parentPath: string | null;
  parentTitleFa?: string;
  parentTitleEn?: string;
}

export const PAGE_META: Record<string, PageMetaItem> = {};

for (const [key, config] of Object.entries(ROUTE_REGISTRY)) {
  const meta: PageMetaItem = {
    titleFa: config.titleFa,
    titleEn: config.titleEn,
    parentPath: config.parentHub,
    parentTitleFa: config.parentTitleFa,
    parentTitleEn: config.parentTitleEn,
  };
  
  PAGE_META[key] = meta;
  
  config.aliases.forEach(alias => {
    const aliasKey = alias.replace(/^\\//, '');
    PAGE_META[aliasKey] = meta;
  });
}
`;

fs.writeFileSync('src/lib/pageMeta.ts', newPageMeta, 'utf8');
console.log('Done');

import { ROUTE_REGISTRY } from './routeRegistry';

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
    const aliasKey = alias.replace(/^\//, '');
    PAGE_META[aliasKey] = meta;
  });
}

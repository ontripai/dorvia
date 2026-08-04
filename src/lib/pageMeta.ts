import { ROUTE_REGISTRY } from './routeRegistry';
import { faTranslations } from './translations/fa';
import { enTranslations } from './translations/en';

export interface PageMetaItem {
  titleFa: string;
  titleEn: string;
  parentPath: string | null;
  parentTitleFa?: string;
  parentTitleEn?: string;
  seoTitleFa?: string;
  seoTitleEn?: string;
  seoDescFa?: string;
  seoDescEn?: string;
  indexable?: boolean;
}

export const PAGE_META: Record<string, PageMetaItem> = {};

for (const [key, config] of Object.entries(ROUTE_REGISTRY)) {
  const seoFa = (faTranslations.seoMetadata as any)?.[key];
  const seoEn = (enTranslations.seoMetadata as any)?.[key];

  const meta: PageMetaItem = {
    titleFa: config.titleFa,
    titleEn: config.titleEn,
    parentPath: config.parentHub,
    parentTitleFa: config.parentTitleFa,
    parentTitleEn: config.parentTitleEn,
    seoTitleFa: seoFa?.title,
    seoTitleEn: seoEn?.title,
    seoDescFa: seoFa?.description,
    seoDescEn: seoEn?.description,
    indexable: config.indexable,
  };
  
  PAGE_META[key] = meta;
  
  config.aliases.forEach(alias => {
    const aliasKey = alias.replace(/^\//, '');
    PAGE_META[aliasKey] = meta;
  });
}

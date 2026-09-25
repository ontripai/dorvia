import { extractItems, cleanText } from './dex-text.mjs';

export function parseNounParadigmTable(tableHtml, targetLemma) {
  const trs = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (trs.length < 2) return null;

  // Track grid with rowspan / colspan
  const grid = [];
  for (let r = 0; r < trs.length; r++) {
    grid[r] = grid[r] || [];
  }

  for (let r = 0; r < trs.length; r++) {
    const cells = [...trs[r][1].matchAll(/<(td|th)([^>]*)>([\s\S]*?)<\/\1>/gi)];
    let col = 0;
    for (const cell of cells) {
      while (grid[r][col] !== undefined) {
        col++;
      }
      const attrs = cell[2];
      const content = cell[3];
      const rowspanMatch = attrs.match(/rowspan=["']?(\d+)["']?/i);
      const colspanMatch = attrs.match(/colspan=["']?(\d+)["']?/i);
      const rowspan = rowspanMatch ? parseInt(rowspanMatch[1], 10) : 1;
      const colspan = colspanMatch ? parseInt(colspanMatch[1], 10) : 1;

      // Extract items
      const items = extractItems(content).filter(it => !it.isElision).map(it => it.cleanText);
      const text = items.length > 0 ? items.join(', ') : cleanText(content);

      for (let ro = 0; ro < rowspan; ro++) {
        for (let co = 0; co < colspan; co++) {
          grid[r + ro] = grid[r + ro] || [];
          grid[r + ro][col + co] = {
            text,
            items,
            rowspan,
            colspan,
            tag: cell[1].toLowerCase(),
            raw: content
          };
        }
      }
      col += colspan;
    }
  }

  // Find column for nearticulat and articulat
  // Typically in row 0
  let nearticulatCol = -1;
  let articulatCol = -1;

  for (let r = 0; r < Math.min(2, grid.length); r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const txt = (grid[r][c]?.text || '').toLowerCase();
      if (txt.includes('nearticulat')) nearticulatCol = c;
      if (txt.includes('articulat') && !txt.includes('nearticulat')) articulatCol = c;
    }
  }

  if (nearticulatCol === -1 && articulatCol === -1) {
    return null;
  }

  // Find rows:
  // We want:
  // 1) nominativ-acuzativ singular
  // 2) nominativ-acuzativ plural
  let nomAccSingularRow = -1;
  let nomAccPluralRow = -1;

  for (let r = 0; r < grid.length; r++) {
    const rowTexts = grid[r].map(c => (c?.text || '').toLowerCase());
    const isNomAcc = rowTexts.some(t => t.includes('nominativ') || t.includes('nom-ac') || t.includes('n-a'));
    const isSingular = rowTexts.some(t => t.includes('singular') || t === 'sg' || t === 'sg.');
    const isPlural = rowTexts.some(t => t.includes('plural') || t === 'pl' || t === 'pl.');

    if (isNomAcc && isSingular) nomAccSingularRow = r;
    else if (isSingular && nomAccSingularRow === -1 && r <= 3) nomAccSingularRow = r;

    if (isNomAcc && isPlural) nomAccPluralRow = r;
    else if (isPlural && nomAccPluralRow === -1 && r <= 4) nomAccPluralRow = r;
  }

  let singularNearticulat = null;
  let singularArticulat = null;
  let pluralNearticulat = null;
  let pluralArticulat = null;

  if (nomAccSingularRow !== -1) {
    if (nearticulatCol !== -1 && grid[nomAccSingularRow][nearticulatCol]) {
      const it = grid[nomAccSingularRow][nearticulatCol].items;
      singularNearticulat = it.length > 0 ? it[0] : grid[nomAccSingularRow][nearticulatCol].text;
    }
    if (articulatCol !== -1 && grid[nomAccSingularRow][articulatCol]) {
      const it = grid[nomAccSingularRow][articulatCol].items;
      singularArticulat = it.length > 0 ? it[0] : grid[nomAccSingularRow][articulatCol].text;
    }
  }

  if (nomAccPluralRow !== -1) {
    if (nearticulatCol !== -1 && grid[nomAccPluralRow][nearticulatCol]) {
      const it = grid[nomAccPluralRow][nearticulatCol].items;
      pluralNearticulat = it.length > 0 ? it[0] : grid[nomAccPluralRow][nearticulatCol].text;
    }
    if (articulatCol !== -1 && grid[nomAccPluralRow][articulatCol]) {
      const it = grid[nomAccPluralRow][articulatCol].items;
      pluralArticulat = it.length > 0 ? it[0] : grid[nomAccPluralRow][articulatCol].text;
    }
  }

  // Filter out placeholders like &mdash;, —, etc.
  const cleanForm = (f) => {
    if (!f) return null;
    const trimmed = f.replace(/&mdash;|—/g, '').trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  return {
    singularNearticulat: cleanForm(singularNearticulat),
    definiteForm: cleanForm(singularArticulat),
    plural: cleanForm(pluralNearticulat),
    pluralArticulat: cleanForm(pluralArticulat),
  };
}

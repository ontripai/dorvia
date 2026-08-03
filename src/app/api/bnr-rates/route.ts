import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

interface ParsedBnrData {
  date: string;
  rates: Record<string, number>;
}

function parseBnrXml(xmlText: string): ParsedBnrData {
  // Extract date attribute from <Cube date="..."> or <PublishingDate>
  const cubeDateMatch = xmlText.match(/<Cube\s+date="([^"]+)">/i) || xmlText.match(/<PublishingDate>([^<]+)<\/PublishingDate>/i);
  const date = cubeDateMatch ? cubeDateMatch[1].trim() : new Date().toISOString().split('T')[0];

  // Extract <Rate currency="EUR">4.9745</Rate> or <Rate currency="HUF" multiplier="100">1.2345</Rate>
  const rateRegex = /<Rate\s+[^>]*currency="([A-Z]{3})"[^>]*>([\d\.]+)<\/Rate>/gi;
  const multiplierRegex = /multiplier="(\d+)"/i;

  const rates: Record<string, number> = {};
  
  // Find all <Rate ...> elements
  const tagMatches = xmlText.match(/<Rate\s+[^>]+>[\d\.]+<\/Rate>/gi) || [];

  for (const tag of tagMatches) {
    const currMatch = tag.match(/currency="([A-Z]{3})"/i);
    const valMatch = tag.match(/>([\d\.]+)<\/Rate>/i);
    
    if (currMatch && valMatch) {
      const currency = currMatch[1].toUpperCase();
      const rawValue = parseFloat(valMatch[1]);
      
      const multMatch = tag.match(multiplierRegex);
      const multiplier = multMatch ? parseFloat(multMatch[1]) : 1;

      if (!isNaN(rawValue) && multiplier > 0) {
        rates[currency] = parseFloat((rawValue / multiplier).toFixed(4));
      }
    }
  }

  return { date, rates };
}

export async function GET() {
  try {
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NextRomania/1.0',
        'Accept': 'application/xml, text/xml, */*'
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`BNR server responded with status: ${response.status}`);
    }

    const xmlText = await response.text();
    const { date, rates } = parseBnrXml(xmlText);

    if (Object.keys(rates).length === 0) {
      throw new Error('Failed to parse any rates from BNR XML feed');
    }

    return NextResponse.json({
      success: true,
      date,
      fetchedAt: new Date().toISOString(),
      source: 'Banca Națională a României (BNR)',
      officialFeedUrl: 'https://www.bnr.ro/nbrfxrates.xml',
      rates
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error: any) {
    console.error('[BNR Feed Error]:', error?.message || error);
    
    return NextResponse.json({
      success: false,
      error: 'در حال حاضر امکان دریافت نرخ زنده وجود ندارد',
      officialSiteUrl: 'https://www.bnr.ro/Cursul-de-schimb-514.aspx',
      timestamp: new Date().toISOString()
    }, { status: 502 });
  }
}

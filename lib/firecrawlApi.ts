/**
 * Firecrawl API Service
 * Scrapes websites to extract business information
 */

const FIRECRAWL_API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;
const FIRECRAWL_API_BASE = 'https://api.firecrawl.dev/v1';

export interface ScrapeResult {
    success: boolean;
    data?: {
        markdown?: string;
        content?: string;
        metadata?: {
            title?: string;
            description?: string;
            language?: string;
            ogTitle?: string;
            ogDescription?: string;
            ogImage?: string;
            siteName?: string;
        };
        links?: string[];
    };
    error?: string;
}

export interface ExtractedBusinessInfo {
    companyName: string;
    tagline?: string;
    description?: string;
    services: string[];
    locations: string[];
    uniqueSellingPoints: string[];
    testimonials: string[];
    portfolioDescriptions: string[];
    contactInfo?: {
        phone?: string;
        email?: string;
        address?: string;
    };
    brandVoice?: string;
}

/**
 * Scrape a single URL using Firecrawl
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
    try {
        const response = await fetch(`${FIRECRAWL_API_BASE}/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url,
                formats: ['markdown'],
                onlyMainContent: true,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Firecrawl error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Firecrawl scrape error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to scrape website',
        };
    }
}

/**
 * Crawl multiple pages of a website
 */
export async function crawlWebsite(url: string, maxPages = 5): Promise<ScrapeResult[]> {
    try {
        // Start crawl job
        const response = await fetch(`${FIRECRAWL_API_BASE}/crawl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url,
                limit: maxPages,
                scrapeOptions: {
                    formats: ['markdown'],
                    onlyMainContent: true,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Crawl failed: ${response.status}`);
        }

        const crawlResult = await response.json();

        if (!crawlResult.success) {
            throw new Error(crawlResult.error || 'Crawl failed');
        }

        // If it's an async job, we need to poll for results
        if (crawlResult.id) {
            return await pollCrawlStatus(crawlResult.id);
        }

        // If data is returned directly
        return crawlResult.data || [];
    } catch (error) {
        console.error('Firecrawl crawl error:', error);
        return [{
            success: false,
            error: error instanceof Error ? error.message : 'Failed to crawl website',
        }];
    }
}

/**
 * Poll crawl status until complete
 */
async function pollCrawlStatus(crawlId: string, maxAttempts = 30): Promise<ScrapeResult[]> {
    for (let i = 0; i < maxAttempts; i++) {
        const response = await fetch(`${FIRECRAWL_API_BASE}/crawl/${crawlId}`, {
            headers: {
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
        });

        const result = await response.json();

        if (result.status === 'completed') {
            return result.data || [];
        }

        if (result.status === 'failed') {
            throw new Error(result.error || 'Crawl job failed');
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Crawl timed out');
}

/**
 * Parse scraped content to extract structured business information
 * This is a basic parser - Claude will do the heavy lifting
 */
export function parseBasicBusinessInfo(scrapeResults: ScrapeResult[]): Partial<ExtractedBusinessInfo> {
    const info: Partial<ExtractedBusinessInfo> = {
        services: [],
        locations: [],
        uniqueSellingPoints: [],
        testimonials: [],
        portfolioDescriptions: [],
    };

    for (const result of scrapeResults) {
        if (!result.success || !result.data) continue;

        // Extract from metadata
        if (result.data.metadata) {
            if (result.data.metadata.siteName && !info.companyName) {
                info.companyName = result.data.metadata.siteName;
            }
            if (result.data.metadata.description && !info.description) {
                info.description = result.data.metadata.description;
            }
            if (result.data.metadata.ogTitle && !info.tagline) {
                info.tagline = result.data.metadata.ogTitle;
            }
        }
    }

    return info;
}

/**
 * Get all scraped content as a single text block for AI processing
 */
export function combineScrapedContent(scrapeResults: ScrapeResult[]): string {
    const contentParts: string[] = [];

    for (const result of scrapeResults) {
        if (!result.success || !result.data) continue;

        // Add metadata context
        if (result.data.metadata) {
            const meta = result.data.metadata;
            if (meta.title) contentParts.push(`Page Title: ${meta.title}`);
            if (meta.description) contentParts.push(`Meta Description: ${meta.description}`);
        }

        // Add main content
        if (result.data.markdown) {
            contentParts.push(result.data.markdown);
        } else if (result.data.content) {
            contentParts.push(result.data.content);
        }

        contentParts.push('\n---\n'); // Separator between pages
    }

    return contentParts.join('\n');
}

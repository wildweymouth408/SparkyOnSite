// Full NEC 2023 structured dataset
// This module provides the complete NEC 2023 text, tables, and figures.
// Data will be loaded from a JSON file (to be generated from PDF).

export interface NECSectionParagraph {
  type: 'paragraph';
  text: string;
  plainEnglish?: string;
  application?: string;
  id?: string;
}

export interface NECSectionList {
  type: 'list';
  items: string[];
}

export interface NECSectionTable {
  type: 'table';
  caption?: string;
  rows: Array<Record<string, string>>;
}

export interface NECSectionFigure {
  type: 'figure';
  caption: string;
  url: string;
}

export interface NECSectionException {
  type: 'exception';
  text: string;
}

export interface NECSectionNote {
  type: 'note';
  text: string;
}

export interface NECSectionViolation {
  type: 'violation';
  scenario: string;
  consequence: string;
  fix: string;
}

export type NECSection = NECSectionParagraph | NECSectionList | NECSectionTable | NECSectionFigure | NECSectionException | NECSectionNote | NECSectionViolation;

export interface NECArticle {
  id: string; // unique identifier e.g., '300.1'
  articleNumber: string; // '300.1'
  title: string;
  chapter: string; // 'Chapter 3: Wiring Methods'
  part?: string; // optional part within chapter
  scope: string; // brief scope description
  content: NECSection[]; // full article content
  relatedArticles: string[]; // references to other articles
  changes?: { type: 'new' | 'revised'; text: string }[]; // NEC 2023 changes
  // Curated data (for common violations)
  keyPoints?: Array<{
    id: string;
    text: string;
    plainEnglish: string;
    application: string;
  }>;
  commonViolations?: Array<{
    scenario: string;
    consequence: string;
    fix: string;
  }>;
}

// Placeholder dataset - to be replaced with full NEC 2023 JSON.
// For MVP, we include Articles 90-110 (General) and 300-392 (Wiring Methods).
// This data will be populated from a JSON file.
import { NEC_ARTICLES_DATA } from './nec-data-generated';
export const NEC_ARTICLES: NECArticle[] = NEC_ARTICLES_DATA;

// Helper to load articles asynchronously (for lazy loading)
export async function loadNECArticles(): Promise<NECArticle[]> {
  // In the future, fetch from a JSON file
  return NEC_ARTICLES;
}

// Search across articles, titles, content
export function searchNECArticles(query: string, articles: NECArticle[]): NECArticle[] {
  const q = query.toLowerCase();
  return articles.filter(article =>
    article.articleNumber.toLowerCase().includes(q) ||
    article.title.toLowerCase().includes(q) ||
    article.scope.toLowerCase().includes(q) ||
    article.content.some(section => section.text.toLowerCase().includes(q))
  );
}

// Get article by number
export function getArticleByNumber(number: string): NECArticle | undefined {
  return NEC_ARTICLES.find(a => a.articleNumber === number);
}

// Get articles by chapter
export function getArticlesByChapter(chapter: string): NECArticle[] {
  return NEC_ARTICLES.filter(a => a.chapter === chapter);
}

// List of chapters
export const CHAPTERS = [
  'Chapter 1: General',
  'Chapter 2: Wiring and Protection',
  'Chapter 3: Wiring Methods',
  'Chapter 4: Equipment for General Use',
  'Chapter 5: Special Occupancies',
  'Chapter 6: Special Equipment',
  'Chapter 7: Special Conditions',
  'Chapter 8: Communications Systems',
  'Chapter 9: Tables',
  'Chapter 10: Administration',
];

// For compatibility with existing code, we also export a curated violations subset
// This matches the old necDatabase schema
export const curatedViolations = [
  // This will be populated from the existing necDatabase
];
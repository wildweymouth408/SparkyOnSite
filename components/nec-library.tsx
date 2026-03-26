'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Mic, Bookmark, ChevronRight, X, Filter } from 'lucide-react'
import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
import { NEC_ARTICLES, NECArticle, CHAPTERS } from '@/lib/nec-data'

// Search index configuration
const fuseOptions: IFuseOptions<NECArticle> = {
  keys: [
    { name: 'articleNumber', weight: 2 },
    { name: 'title', weight: 1.5 },
    { name: 'scope', weight: 1 },
    { name: 'content.text', weight: 0.5 },
  ],
  threshold: 0.4,
  includeMatches: true,
}

export default function NECLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NECArticle | null>(null)
  const fuseRef = useRef<Fuse<NECArticle> | null>(null)

  // Initialize fuse index
  useEffect(() => {
    fuseRef.current = new Fuse(NEC_ARTICLES, fuseOptions)
  }, [])

  // Filter articles based on search, chapter, and bookmarks
  const filteredArticles = useMemo(() => {
    let articles = NEC_ARTICLES
    if (selectedChapter) {
      articles = articles.filter(a => a.chapter === selectedChapter)
    }
    if (showBookmarkedOnly) {
      articles = articles.filter(a => bookmarked.includes(a.id))
    }
    if (searchQuery.trim() && fuseRef.current) {
      const results = fuseRef.current.search(searchQuery)
      articles = results.map(r => r.item)
    }
    return articles
  }, [searchQuery, selectedChapter, showBookmarkedOnly, bookmarked])

  const startVoiceSearch = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => setSearchQuery(event.results[0][0].transcript)
    recognition.start()
  }

  const handleArticleClick = (article: NECArticle) => {
    setSelectedArticle(article)
  }

  const handleBack = () => {
    setSelectedArticle(null)
  }

  if (selectedArticle) {
    return (
      <ArticleDetail article={selectedArticle} onBack={handleBack} />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search header */}
      <div className="sticky top-0 bg-zinc-950 field-mode:bg-black z-10 pb-3 border-b border-zinc-900 field-mode:border-yellow-400/20 mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 field-mode:text-yellow-400/50" />
          <input
            type="text"
            placeholder="Search NEC articles by number, title, or content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 field-mode:bg-black border border-zinc-800 field-mode:border-yellow-400/30 rounded-xl pl-9 pr-20 py-2.5 text-sm text-white field-mode:text-yellow-100 placeholder-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={startVoiceSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 ${isListening ? 'text-red-400 animate-pulse' : 'text-orange-500'}`}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {/* Chapter filter */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <span className="text-xs text-zinc-400">Filter by chapter:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            key="all"
            onClick={() => setSelectedChapter('')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${!selectedChapter ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
          >
            All Chapters
          </button>
          {CHAPTERS.map(chapter => (
            <button
              key={chapter}
              onClick={() => setSelectedChapter(chapter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${selectedChapter === chapter ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
            >
              {chapter}
            </button>
          ))}
        </div>
        {/* Bookmark filter */}
        <div className="flex items-center gap-2 mt-2">
          <Bookmark className="h-4 w-4 text-zinc-500" />
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${showBookmarkedOnly ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
          >
            Show bookmarked only
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="px-1 mb-3 text-xs text-zinc-500 font-mono">
        {filteredArticles.length === NEC_ARTICLES.length ? (
          <span>{NEC_ARTICLES.length} articles</span>
        ) : (
          <span>{filteredArticles.length} articles found</span>
        )}
      </div>

      {/* Articles list */}
      <div className="space-y-4 overflow-y-auto flex-1 pb-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No articles found. Try a different search or filter.
          </div>
        ) : (
          filteredArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              isBookmarked={bookmarked.includes(article.id)}
              onBookmark={() => setBookmarked(prev =>
                prev.includes(article.id) ? prev.filter(id => id !== article.id) : [...prev, article.id]
              )}
              onClick={() => handleArticleClick(article)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Sub-components

interface ArticleCardProps {
  article: NECArticle
  isBookmarked: boolean
  onBookmark: () => void
  onClick: () => void
}

function ArticleCard({ article, isBookmarked, onBookmark, onClick }: ArticleCardProps) {
  return (
    <div
      className="electric-card bg-zinc-900 field-mode:bg-black border border-zinc-800 field-mode:border-yellow-400/30 rounded-xl overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
      onClick={onClick}
    >
      <div className="bg-zinc-900/80 field-mode:bg-black p-3 border-b border-zinc-800 field-mode:border-yellow-400/20 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[#f97316] field-mode:text-yellow-300 font-bold text-sm font-mono">{article.articleNumber}</span>
            <span className="text-xs text-zinc-500">{article.chapter}</span>
          </div>
          <h3 className="text-white field-mode:text-yellow-100 font-semibold text-sm mt-1">{article.title}</h3>
          <p className="text-zinc-500 field-mode:text-yellow-400/50 text-xs mt-1">{article.scope}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          className="ml-2"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#f97316] text-[#f97316]' : 'text-zinc-500'}`} />
        </button>
      </div>
      <div className="p-3">
        {article.content.slice(0, 2).map((section, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            {section.type === 'paragraph' && (
              <div className="text-xs text-zinc-400 field-mode:text-yellow-400/60 line-clamp-2 font-mono">{section.text}</div>
            )}
            {section.type === 'table' && (
              <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Table: {section.caption?.split('—')[0]?.trim()}</div>
            )}
            {section.type === 'violation' && (
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 mt-0.5 shrink-0">VIO</span>
                <span className="text-xs text-zinc-400">{section.scenario}</span>
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-zinc-800/50">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{article.content.length} sections</span>
          {article.content.some((s: any) => s.type === 'table') && (
            <span className="text-[10px] font-mono text-orange-500/70 uppercase tracking-wider">+ tables</span>
          )}
          {article.content.some((s: any) => s.type === 'violation') && (
            <span className="text-[10px] font-mono text-red-500/70 uppercase tracking-wider">+ violations</span>
          )}
        </div>
      </div>
    </div>
  )
}

interface ArticleDetailProps {
  article: NECArticle
  onBack: () => void
}

function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-zinc-950 field-mode:bg-black z-10 p-3 border-b border-zinc-900 field-mode:border-yellow-400/20 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-[#f97316] field-mode:text-yellow-300 p-1"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#f97316] field-mode:text-yellow-300 font-bold text-lg font-mono">{article.articleNumber}</span>
            <span className="text-xs text-zinc-500">{article.chapter}</span>
          </div>
          <h1 className="text-white field-mode:text-yellow-100 font-bold text-lg">{article.title}</h1>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-6 bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Scope</h2>
          <p className="text-zinc-300 field-mode:text-yellow-100 text-sm">{article.scope}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-orange-400 mb-3">Code Sections</h2>
          <div className="space-y-3">
            {article.content.map((section, idx) => (
              <SectionRenderer key={idx} section={section} />
            ))}
          </div>
        </div>

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Related Articles</h2>
            <div className="flex flex-wrap gap-2">
              {article.relatedArticles.map(art => (
                <span
                  key={art}
                  className="px-2.5 py-1 bg-zinc-900 text-orange-400 text-[11px] font-mono border border-zinc-800 rounded"
                >
                  {art}
                </span>
              ))}
            </div>
          </div>
        )}

        {article.changes && article.changes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">NEC 2023 Changes</h2>
            <div className="space-y-2">
              {article.changes.map((change, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 ${change.type === 'new' ? 'border-orange-500 bg-orange-900/20' : 'border-amber-500 bg-amber-900/20'}`}>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${change.type === 'new' ? 'text-orange-400' : 'text-amber-400'}`}>
                    {change.type === 'new' ? 'New' : 'Revised'}
                  </span>
                  <p className="text-zinc-200 field-mode:text-yellow-100 text-sm mt-1">{change.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionRenderer({ section }: { section: any }) {
  switch (section.type) {
    case 'paragraph':
      return (
        <div className="border-l-2 border-orange-500/60 pl-3 py-1">
          {section.id && (
            <span className="text-orange-400 text-[10px] font-mono font-bold uppercase tracking-wider">{section.id}</span>
          )}
          <p className="text-zinc-200 field-mode:text-yellow-100 text-sm mt-1 leading-relaxed">{section.text}</p>
          {section.plainEnglish && (
            <div className="mt-2 bg-zinc-900/60 border border-zinc-800/60 rounded px-3 py-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Plain English</span>
              <p className="text-zinc-300 field-mode:text-yellow-400/70 text-xs mt-0.5 italic">{section.plainEnglish}</p>
            </div>
          )}
          {section.application && (
            <p className="text-orange-400/70 field-mode:text-yellow-300/80 text-[11px] mt-1.5 font-mono">→ {section.application}</p>
          )}
        </div>
      )
    case 'list':
      return (
        <div className="border-l-2 border-orange-500/60 pl-3 py-1">
          <ul className="space-y-1">
            {section.items.map((item: string, idx: number) => (
              <li key={idx} className="text-zinc-200 field-mode:text-yellow-100 text-sm flex gap-2">
                <span className="text-orange-500 mt-1 shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    case 'violation':
      return (
        <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 border border-red-800/50 px-1.5 py-0.5 rounded">VIOLATION</span>
          </div>
          <p className="text-red-300 text-sm font-medium mb-2">{section.scenario}</p>
          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Consequence</span>
              <p className="text-zinc-400 text-xs mt-0.5">{section.consequence}</p>
            </div>
            <div className="border-t border-red-900/30 pt-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-500">Fix</span>
              <p className="text-orange-300 field-mode:text-yellow-300 text-xs mt-0.5">{section.fix}</p>
            </div>
          </div>
        </div>
      )
    case 'table':
      if (!section.rows || section.rows.length === 0) return null
      const columns = Object.keys(section.rows[0])
      return (
        <div className="rounded-lg overflow-hidden border border-zinc-800">
          {section.caption && (
            <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400">{section.caption}</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-700">
                  {columns.map((key, i) => (
                    <th key={key} className={`text-left px-3 py-2 text-orange-400 font-mono uppercase text-[10px] tracking-wider whitespace-nowrap ${i === 0 ? 'border-l-2 border-orange-500' : ''}`}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row: Record<string, string>, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-zinc-900/30' : ''}>
                    {columns.map((col, colIdx) => (
                      <td key={col} className={`px-3 py-2 text-zinc-200 whitespace-nowrap ${colIdx === 0 ? 'border-l-2 border-orange-500/40 font-medium text-zinc-100' : 'text-zinc-300'}`}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    default:
      return null
  }
}
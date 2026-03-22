'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Mic, Bookmark, AlertTriangle, ChevronRight, X, Check, Zap, BookOpen, Filter } from 'lucide-react'
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
      <div className="sticky top-0 bg-[#0f1115] field-mode:bg-black z-10 pb-3 border-b border-[#1e2028] field-mode:border-yellow-400/20 mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555] field-mode:text-yellow-400/50" />
          <input
            type="text"
            placeholder="Search NEC articles by number, title, or content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] field-mode:bg-black border border-[#2a2a35] field-mode:border-yellow-400/30 pl-9 pr-20 py-2.5 text-sm text-white field-mode:text-yellow-100 placeholder-[#555] focus:border-[#22c55e] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-[#888] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={startVoiceSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 ${isListening ? 'text-red-400 animate-pulse' : 'text-[#22c55e]'}`}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {/* Chapter filter */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-[#555]" />
          <span className="text-xs text-[#888]">Filter by chapter:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            key="all"
            onClick={() => setSelectedChapter('')}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${!selectedChapter ? 'bg-[#22c55e] text-[#0f1115] border-[#22c55e]' : 'bg-[#111] text-[#888] border-[#2a2a35]'}`}
          >
            All Chapters
          </button>
          {CHAPTERS.map(chapter => (
            <button
              key={chapter}
              onClick={() => setSelectedChapter(chapter)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${selectedChapter === chapter ? 'bg-[#22c55e] text-[#0f1115] border-[#22c55e]' : 'bg-[#111] text-[#888] border-[#2a2a35]'}`}
            >
              {chapter}
            </button>
          ))}
        </div>
        {/* Bookmark filter */}
        <div className="flex items-center gap-2 mt-2">
          <Bookmark className="h-4 w-4 text-[#555]" />
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${showBookmarkedOnly ? 'bg-[#22c55e] text-[#0f1115] border-[#22c55e]' : 'bg-[#111] text-[#888] border-[#2a2a35]'}`}
          >
            Show bookmarked only
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="px-1 mb-3 text-xs text-[#666]">
        {filteredArticles.length === NEC_ARTICLES.length ? (
          <span>Showing all {NEC_ARTICLES.length} articles</span>
        ) : (
          <span>Showing {filteredArticles.length} of {NEC_ARTICLES.length} articles</span>
        )}
      </div>

      {/* Articles list */}
      <div className="space-y-4 overflow-y-auto flex-1 pb-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-[#666] text-sm">
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
      className="bg-[#111] field-mode:bg-black border border-[#2a2a35] field-mode:border-yellow-400/30 overflow-hidden cursor-pointer hover:border-[#22c55e] transition-colors"
      onClick={onClick}
    >
      <div className="bg-[#161b24] field-mode:bg-black p-3 border-b border-[#2a2a35] field-mode:border-yellow-400/20 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[#22c55e] field-mode:text-yellow-300 font-bold text-sm font-mono">{article.articleNumber}</span>
            <span className="text-xs text-[#666]">{article.chapter}</span>
          </div>
          <h3 className="text-white field-mode:text-yellow-100 font-semibold text-sm mt-1">{article.title}</h3>
          <p className="text-[#666] field-mode:text-yellow-400/50 text-xs mt-1">{article.scope}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          className="ml-2"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#22c55e] text-[#22c55e]' : 'text-[#555]'}`} />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 text-xs text-[#888] mb-2">
          <BookOpen className="h-3 w-3" />
          <span>{article.content.length} sections</span>
        </div>
        {article.content.slice(0, 2).map((section, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            {section.type === 'paragraph' && (
              <div className="text-sm text-white field-mode:text-yellow-100 line-clamp-2">{section.text}</div>
            )}
            {section.type === 'violation' && (
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                <span className="text-xs text-red-300">{section.scenario}</span>
              </div>
            )}
          </div>
        ))}
        {article.content.length > 2 && (
          <div className="text-xs text-[#22c55e] field-mode:text-yellow-300 mt-2">
            + {article.content.length - 2} more sections
          </div>
        )}
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
      <div className="sticky top-0 bg-[#0f1115] field-mode:bg-black z-10 p-3 border-b border-[#1e2028] field-mode:border-yellow-400/20 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-[#22c55e] field-mode:text-yellow-300 p-1"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#22c55e] field-mode:text-yellow-300 font-bold text-lg font-mono">{article.articleNumber}</span>
            <span className="text-xs text-[#666]">{article.chapter}</span>
          </div>
          <h1 className="text-white field-mode:text-yellow-100 font-bold text-lg">{article.title}</h1>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm uppercase tracking-wider text-[#888] mb-2">Scope</h2>
          <p className="text-white field-mode:text-yellow-100">{article.scope}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm uppercase tracking-wider text-[#888] mb-2">Content</h2>
          <div className="space-y-4">
            {article.content.map((section, idx) => (
              <SectionRenderer key={idx} section={section} />
            ))}
          </div>
        </div>

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-[#888] mb-2">Related Articles</h2>
            <div className="flex flex-wrap gap-2">
              {article.relatedArticles.map(art => (
                <button
                  key={art}
                  className="px-3 py-1.5 bg-[#111] field-mode:bg-black text-[#00d4ff] field-mode:text-yellow-300 text-xs border border-[#2a2a35] field-mode:border-yellow-400/30 hover:border-[#00d4ff]"
                >
                  {art}
                </button>
              ))}
            </div>
          </div>
        )}

        {article.changes && article.changes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-[#888] mb-2">NEC 2023 Changes</h2>
            <div className="space-y-2">
              {article.changes.map((change, idx) => (
                <div key={idx} className={`p-3 border-l-4 ${change.type === 'new' ? 'border-[#22c55e] bg-green-900/20' : 'border-[#ffaa00] bg-yellow-900/20'}`}>
                  <span className={`text-xs font-bold uppercase ${change.type === 'new' ? 'text-[#22c55e]' : 'text-[#ffaa00]'}`}>
                    {change.type === 'new' ? 'New' : 'Revised'}
                  </span>
                  <p className="text-white field-mode:text-yellow-100 mt-1">{change.text}</p>
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
        <div className="p-3 bg-[#0a0b0e] field-mode:bg-black border-l-2 border-[#22c55e] field-mode:border-yellow-400">
          {section.id && (
            <span className="text-[#22c55e] field-mode:text-yellow-300 text-xs font-mono font-bold">{section.id}</span>
          )}
          <p className="text-white field-mode:text-yellow-100 text-sm mt-1">{section.text}</p>
          {section.plainEnglish && (
            <p className="text-[#555] field-mode:text-yellow-400/40 text-xs italic mt-1">Plain English: {section.plainEnglish}</p>
          )}
          {section.application && (
            <p className="text-[#00d4ff] field-mode:text-yellow-300/80 text-xs mt-1">Application: {section.application}</p>
          )}
        </div>
      )
    case 'list':
      return (
        <div className="p-3 bg-[#0a0b0e] field-mode:bg-black border-l-2 border-[#00d4ff]">
          <ul className="list-disc pl-4 space-y-1">
            {section.items.map((item: string, idx: number) => (
              <li key={idx} className="text-white field-mode:text-yellow-100 text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )
    case 'violation':
      return (
        <div className="p-3 bg-[#130d10] field-mode:bg-black border-l-2 border-red-500">
          <div className="flex items-start gap-2">
            <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-semibold">{section.scenario}</p>
              <p className="text-red-400/80 text-xs mt-1">Consequence: {section.consequence}</p>
              <div className="flex items-start gap-1.5 mt-2">
                <Check className="h-4 w-4 text-[#22c55e] mt-0.5 shrink-0" />
                <p className="text-[#22c55e] field-mode:text-yellow-300 text-xs">{section.fix}</p>
              </div>
            </div>
          </div>
        </div>
      )
    case 'table':
      return (
        <div className="p-3 bg-[#0a0b0e] field-mode:bg-black border border-[#2a2a35]">
          <div className="text-xs text-[#888] mb-2">Table: {section.caption || 'Data'}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#333] text-[#555]">
                  {Object.keys(section.rows[0] || {}).map(key => (
                    <th key={key} className="text-left py-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2028]">
                {section.rows.map((row: Record<string, string>, idx: number) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, colIdx) => (
                      <td key={colIdx} className="py-1.5 text-white field-mode:text-yellow-100">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    default:
      return (
        <div className="p-3 bg-[#0a0b0e] field-mode:bg-black border border-[#2a2a35]">
          <p className="text-white field-mode:text-yellow-100">{JSON.stringify(section)}</p>
        </div>
      )
  }
}
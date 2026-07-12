'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { FileText, Loader2, AlertCircle, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MemoryFile {
  id: string
  name: string
  title: string
  path: string
  content: string
}

const fmt = new Intl.NumberFormat()

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}

export function MemoryTab() {
  const [files, setFiles] = React.useState<MemoryFile[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    fetch('/api/memory', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { files: MemoryFile[]; error?: string }) => {
        if (!alive) return
        setFiles(data.files ?? [])
        setError(data.error ?? null)
        if (data.files?.length) setActiveId(data.files[0].id)
        setLoading(false)
      })
      .catch((e) => {
        if (!alive) return
        setError(e.message)
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const active = files.find((f) => f.id === activeId) ?? null

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Reading memory files…
      </div>
    )
  }

  if (error || files.length === 0) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 text-destructive" />
        <div>
          <p className="font-medium text-destructive">No memory files found.</p>
          <p className="text-muted-foreground">
            {error ??
              'The memory/ folder could not be read. This breaks the dashboard contract (memory/06).'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* File list */}
      <div className="rounded-lg border">
        <div className="border-b px-3 py-2.5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Workflow memory
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {files.length} files · read live from <code className="font-mono">memory/</code>
          </p>
        </div>
        <ScrollArea className="max-h-[520px]">
          <div className="p-1.5">
            {files.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveId(f.id)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  activeId === f.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <FileText className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{f.title}</span>
                  <span className="block truncate font-mono text-[10px] opacity-60">
                    {f.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Active file */}
      <div className="rounded-lg border">
        {active && (
          <>
            <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{active.title}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {active.path} · {fmt.format(countWords(active.content))} words
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => {
                  navigator.clipboard?.writeText(active.content)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1400)
                }}
              >
                {copied ? (
                  <Check className="size-3.5 text-[var(--chart-2)]" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <ScrollArea className="max-h-[520px]">
              <div className="px-5 py-4">
                <MarkdownView source={active.content} />
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  )
}

function MarkdownView({ source }: { source: string }) {
  return (
    <div className="text-sm leading-relaxed text-foreground/90">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-2 text-lg font-semibold tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-base font-semibold tracking-tight">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1.5 mt-4 text-sm font-semibold">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-foreground/80">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-1 space-y-1.5 text-foreground/80">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-1 list-decimal space-y-1.5 pl-4 text-foreground/80">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-3">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="text-foreground">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-lg border bg-muted/50 p-3 font-mono text-[12px] leading-relaxed">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-foreground/20 pl-3 text-foreground/70 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-5 border-border" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted/50 px-2.5 py-1.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2.5 py-1.5 align-top">{children}</td>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

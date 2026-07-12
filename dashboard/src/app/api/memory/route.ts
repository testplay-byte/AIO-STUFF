import { NextResponse } from 'next/server'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

interface MemoryFile {
  id: string
  name: string
  title: string
  path: string
  content: string
}

const MEMORY_DIR = path.join(process.cwd(), 'memory')

function titleFromName(file: string): string {
  // 00-project-overview.md -> "Project Overview"
  const base = file.replace(/\.md$/, '')
  const noPrefix = base.replace(/^\d+-/, '')
  return noPrefix
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function GET() {
  try {
    const entries = await readdir(MEMORY_DIR)
    const files = entries.filter((f) => f.endsWith('.md')).sort()

    const out: MemoryFile[] = await Promise.all(
      files.map(async (f) => {
        const full = path.join(MEMORY_DIR, f)
        const content = await readFile(full, 'utf8')
        return {
          id: f.replace(/\.md$/, ''),
          name: f,
          title: titleFromName(f),
          path: `memory/${f}`,
          content,
        }
      })
    )

    return NextResponse.json({ files: out })
  } catch (err) {
    return NextResponse.json(
      {
        files: [],
        error:
          err instanceof Error ? err.message : 'Could not read memory directory',
      },
      { status: 200 }
    )
  }
}

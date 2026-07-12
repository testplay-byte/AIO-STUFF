'use client'

import { Folder, FileText, FilePlus } from 'lucide-react'
import type { StructureNode } from '@/lib/atlas/state'
import { cn } from '@/lib/utils'

function NodeRow({ node, depth }: { node: StructureNode; depth: number }) {
  const isFolder = node.type === 'folder'
  const Icon = isFolder ? Folder : node.name.endsWith('.md') ? FileText : FilePlus

  return (
    <>
      <div
        className="flex items-start gap-2 py-1 text-xs leading-relaxed"
        style={{ paddingLeft: `${depth * 18}px` }}
      >
        <Icon
          className={cn(
            'mt-[2px] size-3.5 shrink-0',
            isFolder ? 'text-foreground/70' : 'text-muted-foreground'
          )}
        />
        <span
          className={cn(
            'font-mono',
            isFolder ? 'font-semibold text-foreground' : 'text-foreground/80'
          )}
        >
          {node.name}
        </span>
        {node.status === 'live' && (
          <span className="mt-[1px] rounded-sm bg-[var(--chart-2)]/15 px-1 py-px text-[10px] font-medium text-[var(--chart-2)]">
            live
          </span>
        )}
        {node.status === 'planned' && (
          <span className="mt-[1px] rounded-sm bg-muted px-1 py-px text-[10px] font-medium text-muted-foreground">
            planned
          </span>
        )}
        {node.note && (
          <span className="text-muted-foreground">— {node.note}</span>
        )}
      </div>
      {node.children?.map((child) => (
        <NodeRow key={child.name + depth} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

export function StructureTree({ root }: { root: StructureNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="max-h-[460px] overflow-auto pr-2">
        <NodeRow node={root} depth={0} />
      </div>
    </div>
  )
}

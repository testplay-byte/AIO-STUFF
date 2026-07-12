'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from 'recharts'
import type { DimensionStat } from '@/lib/atlas/state'

const TOKEN_TO_VAR: Record<string, string> = {
  'chart-1': 'var(--chart-1)',
  'chart-2': 'var(--chart-2)',
  'chart-3': 'var(--chart-3)',
  'chart-4': 'var(--chart-4)',
  'chart-5': 'var(--chart-5)',
}

export function CoverageRadar({ data }: { data: DimensionStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          data="kind"
          dataKey="dimension"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Coverage"
          dataKey="score"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0.18}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function DistributionDonut({
  data,
}: {
  data: { name: string; value: number; tone: string }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={2}
          stroke="var(--background)"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={TOKEN_TO_VAR[entry.tone] ?? 'var(--chart-3)'}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

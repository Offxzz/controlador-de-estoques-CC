'use client'

import { useStore } from '@/lib/store-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sun, Sunset, Moon, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

export function DailyStatsPanel() {
  const { getDailyStats } = useStore()
  
  const today = new Date().toISOString().split('T')[0]
  const stats = getDailyStats(today)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Movimentação do Dia
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totais do dia */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-success">Entradas</span>
            </div>
            <p className="text-2xl font-bold text-success">{stats.totalIn}</p>
            <p className="text-xs text-muted-foreground">unidades hoje</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">Saídas</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.totalOut}</p>
            <p className="text-xs text-muted-foreground">unidades hoje</p>
          </div>
        </div>

        {/* Por turno */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Por Turno</h4>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-warning" />
              <span className="text-foreground">Manhã</span>
              <span className="text-xs text-muted-foreground">(06h - 12h)</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stats.shifts.morning}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Sunset className="h-5 w-5 text-chart-3" />
              <span className="text-foreground">Tarde</span>
              <span className="text-xs text-muted-foreground">(12h - 18h)</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stats.shifts.afternoon}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-chart-5" />
              <span className="text-foreground">Noite</span>
              <span className="text-xs text-muted-foreground">(18h - 06h)</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stats.shifts.night}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

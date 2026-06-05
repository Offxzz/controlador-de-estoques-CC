'use client'

import { useStore } from '@/lib/store-context'
import { Card, CardContent } from '@/components/ui/card'
import { Package, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'

export function StatsOverview() {
  const { products, movements } = useStore()

  const today = new Date().toISOString().split('T')[0]
  const todayMovements = movements.filter(m => m.date === today)

  const criticalProducts = products.filter(p => p.currentQuantity <= p.quantityMinimum)
  const warningProducts = products.filter(
    p => p.currentQuantity > p.quantityMinimum && p.currentQuantity < p.quantityAcceptable
  )
  const normalProducts = products.filter(p => p.currentQuantity >= p.quantityAcceptable)

  const stats = [
    {
      label: 'Total de Produtos',
      value: products.length,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Estoque Normal',
      value: normalProducts.length,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Atenção',
      value: warningProducts.length,
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Crítico',
      value: criticalProducts.length,
      icon: TrendingDown,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

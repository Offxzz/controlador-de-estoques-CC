'use client'

import { useStore } from '@/lib/store-context'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { History, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

export function MovementHistory() {
  const { movements } = useStore()

  const sortedMovements = [...movements].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getShiftBadge = (shift: string) => {
    const colors: Record<string, string> = {
      'Manhã': 'bg-chart-4 text-chart-4-foreground',
      'Tarde': 'bg-chart-1 text-primary-foreground',
      'Noite': 'bg-chart-5 text-foreground',
    }
    return (
      <Badge className={colors[shift] || 'bg-muted'}>
        {shift}
      </Badge>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <History className="h-5 w-5 text-primary" />
          Histórico de Movimentações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Produto</TableHead>
                <TableHead className="text-center text-muted-foreground">Qtd</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Hora</TableHead>
                <TableHead className="text-muted-foreground">Turno</TableHead>
                <TableHead className="text-muted-foreground">Entregou</TableHead>
                <TableHead className="text-muted-foreground">Retirou</TableHead>
                <TableHead className="text-muted-foreground">Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMovements.map((movement) => (
                <TableRow key={movement.id} className="border-border hover:bg-muted/30">
                  <TableCell>
                    {movement.type === 'entrada' ? (
                      <Badge className="flex items-center gap-1 bg-success text-success-foreground">
                        <ArrowDownCircle className="h-3 w-3" />
                        Entrada
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <ArrowUpCircle className="h-3 w-3" />
                        Saída
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{movement.productName}</TableCell>
                  <TableCell className="text-center text-foreground">{movement.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(movement.date)}</TableCell>
                  <TableCell className="text-muted-foreground">{movement.time}</TableCell>
                  <TableCell>{getShiftBadge(movement.shift)}</TableCell>
                  <TableCell className="text-muted-foreground">{movement.responsibleDelivery}</TableCell>
                  <TableCell className="text-muted-foreground">{movement.responsibleWithdrawal}</TableCell>
                  <TableCell className="text-muted-foreground">{movement.location}</TableCell>
                </TableRow>
              ))}
              {sortedMovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhuma movimentação registrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

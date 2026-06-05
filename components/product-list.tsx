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
import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function ProductList() {
  const { products } = useStore()

  const getStatusBadge = (current: number, minimum: number, acceptable: number) => {
    if (current <= minimum) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Crítico
        </Badge>
      )
    }
    if (current < acceptable) {
      return (
        <Badge className="flex items-center gap-1 bg-warning text-warning-foreground">
          <AlertTriangle className="h-3 w-3" />
          Atenção
        </Badge>
      )
    }
    return (
      <Badge className="flex items-center gap-1 bg-success text-success-foreground">
        <CheckCircle className="h-3 w-3" />
        Normal
      </Badge>
    )
  }

  const getQuantityColor = (current: number, minimum: number, acceptable: number) => {
    if (current <= minimum) return 'text-destructive font-bold'
    if (current < acceptable) return 'text-warning font-semibold'
    return 'text-success'
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Package className="h-5 w-5 text-primary" />
          Inventário de Produtos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Produto</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Local</TableHead>
                <TableHead className="text-center text-muted-foreground">Atual</TableHead>
                <TableHead className="text-center text-muted-foreground">Mín.</TableHead>
                <TableHead className="text-center text-muted-foreground">Aceitável</TableHead>
                <TableHead className="text-center text-muted-foreground">Total</TableHead>
                <TableHead className="text-center text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-muted-foreground">{product.location}</TableCell>
                  <TableCell className={`text-center ${getQuantityColor(product.currentQuantity, product.quantityMinimum, product.quantityAcceptable)}`}>
                    {product.currentQuantity}
                  </TableCell>
                  <TableCell className="text-center text-destructive">{product.quantityMinimum}</TableCell>
                  <TableCell className="text-center text-warning">{product.quantityAcceptable}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{product.quantityTotal}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(product.currentQuantity, product.quantityMinimum, product.quantityAcceptable)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store-context'
import { getShift } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from 'lucide-react'

type MovementType = 'entrada' | 'saida'

export function MovementForm() {
  const { products, addMovement } = useStore()
  const [type, setType] = useState<MovementType>('saida')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [responsibleDelivery, setResponsibleDelivery] = useState('')
  const [responsibleWithdrawal, setResponsibleWithdrawal] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const product = products.find(p => p.id === productId)
    if (!product) return

    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)

    addMovement({
      productId,
      productName: product.name,
      type,
      quantity: parseInt(quantity),
      date,
      time,
      shift: getShift(time),
      responsibleDelivery,
      responsibleWithdrawal,
      location: product.location,
    })

    // Reset form
    setProductId('')
    setQuantity('')
    setResponsibleDelivery('')
    setResponsibleWithdrawal('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const selectedProduct = products.find(p => p.id === productId)
  const maxQuantity = type === 'saida' && selectedProduct 
    ? selectedProduct.currentQuantity 
    : 999

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          {type === 'entrada' ? (
            <ArrowDownCircle className="h-5 w-5 text-success" />
          ) : (
            <ArrowUpCircle className="h-5 w-5 text-destructive" />
          )}
          Registrar Movimentação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'saida' ? 'default' : 'outline'}
              onClick={() => setType('saida')}
              className={`flex-1 ${type === 'saida' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}`}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Saída
            </Button>
            <Button
              type="button"
              variant={type === 'entrada' ? 'default' : 'outline'}
              onClick={() => setType('entrada')}
              className={`flex-1 ${type === 'entrada' ? 'bg-success text-success-foreground hover:bg-success/90' : ''}`}
            >
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Entrada
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product" className="text-foreground">Produto</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.currentQuantity} disponíveis)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Digite a quantidade"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            {type === 'saida' && selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Máximo disponível: {selectedProduct.currentQuantity}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibleDelivery" className="text-foreground">
              Responsável pela {type === 'entrada' ? 'Entrega' : 'Liberação'}
            </Label>
            <Input
              id="responsibleDelivery"
              value={responsibleDelivery}
              onChange={(e) => setResponsibleDelivery(e.target.value)}
              placeholder={type === 'entrada' ? 'Nome do fornecedor/entregador' : 'Nome do funcionário que liberou'}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibleWithdrawal" className="text-foreground">
              Responsável pela {type === 'entrada' ? 'Recepção' : 'Retirada'}
            </Label>
            <Input
              id="responsibleWithdrawal"
              value={responsibleWithdrawal}
              onChange={(e) => setResponsibleWithdrawal(e.target.value)}
              placeholder={type === 'entrada' ? 'Nome de quem recebeu' : 'Nome de quem retirou'}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!productId || !quantity || !responsibleDelivery || !responsibleWithdrawal}
          >
            Registrar {type === 'entrada' ? 'Entrada' : 'Saída'}
          </Button>

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/20 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span>Movimentação registrada com sucesso!</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

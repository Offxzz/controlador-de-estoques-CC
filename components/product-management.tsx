'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store-context'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: 'Almoxarifado',
    quantityTotal: '20',
    quantityMinimum: '5',
    quantityAcceptable: '15',
    currentQuantity: '20',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      location: 'Almoxarifado',
      quantityTotal: '20',
      quantityMinimum: '5',
      quantityAcceptable: '15',
      currentQuantity: '20',
    })
  }

  const handleAdd = () => {
    addProduct({
      name: formData.name,
      category: formData.category,
      location: formData.location,
      quantityTotal: parseInt(formData.quantityTotal),
      quantityMinimum: parseInt(formData.quantityMinimum),
      quantityAcceptable: parseInt(formData.quantityAcceptable),
      currentQuantity: parseInt(formData.currentQuantity),
    })
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        location: product.location,
        quantityTotal: product.quantityTotal.toString(),
        quantityMinimum: product.quantityMinimum.toString(),
        quantityAcceptable: product.quantityAcceptable.toString(),
        currentQuantity: product.currentQuantity.toString(),
      })
      setEditingProduct(productId)
    }
  }

  const handleUpdate = () => {
    if (!editingProduct) return
    
    updateProduct(editingProduct, {
      name: formData.name,
      category: formData.category,
      location: formData.location,
      quantityTotal: parseInt(formData.quantityTotal),
      quantityMinimum: parseInt(formData.quantityMinimum),
      quantityAcceptable: parseInt(formData.quantityAcceptable),
      currentQuantity: parseInt(formData.currentQuantity),
    })
    resetForm()
    setEditingProduct(null)
  }

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId)
    }
  }

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

  const ProductForm = ({ onSubmit, buttonText }: { onSubmit: () => void; buttonText: string }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && formData.name.trim()) {
        e.preventDefault()
        onSubmit()
      }
    }

    return (
      <div className="space-y-4" onKeyDown={handleKeyDown}>
        <div className="space-y-2">
          <Label className="text-foreground">Nome do Produto</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Detergente"
            className="bg-input border-border text-foreground"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="Limpeza">Limpeza</SelectItem>
              <SelectItem value="Equipamento">Equipamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Local</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="Almoxarifado">Almoxarifado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Qtd. Total</Label>
            <Input
              type="number"
              value={formData.quantityTotal}
              onChange={(e) => setFormData({ ...formData, quantityTotal: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Qtd. Atual</Label>
            <Input
              type="number"
              value={formData.currentQuantity}
              onChange={(e) => setFormData({ ...formData, currentQuantity: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Qtd. Minima</Label>
            <Input
              type="number"
              value={formData.quantityMinimum}
              onChange={(e) => setFormData({ ...formData, quantityMinimum: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Qtd. Aceitavel</Label>
            <Input
              type="number"
              value={formData.quantityAcceptable}
              onChange={(e) => setFormData({ ...formData, quantityAcceptable: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Pressione Enter para salvar rapidamente
        </p>
        <Button onClick={onSubmit} className="w-full bg-primary text-primary-foreground">
          {buttonText}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-5 w-5 text-primary" />
            Gerenciar Produtos
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger
              render={
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              }
            />
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Adicionar Produto</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleAdd} buttonText="Adicionar" />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Produto</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Local</TableHead>
                <TableHead className="text-center text-muted-foreground">Atual</TableHead>
                <TableHead className="text-center text-muted-foreground">Status</TableHead>
                <TableHead className="text-center text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-muted-foreground">{product.location}</TableCell>
                  <TableCell className="text-center text-foreground">{product.currentQuantity}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(product.currentQuantity, product.quantityMinimum, product.quantityAcceptable)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Dialog open={editingProduct === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                        <DialogTrigger
                          render={
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product.id)}
                              className="border-border"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="text-card-foreground">Editar Produto</DialogTitle>
                          </DialogHeader>
                          <ProductForm onSubmit={handleUpdate} buttonText="Salvar" />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

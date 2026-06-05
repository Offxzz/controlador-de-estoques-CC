// Store de dados com estado compartilhado usando padrão singleton
// Em produção, isso seria substituído por um banco de dados

export interface Product {
  id: string
  name: string
  category: string
  quantityTotal: number
  quantityMinimum: number
  quantityAcceptable: number
  currentQuantity: number
  location: string
}

export interface Movement {
  id: string
  productId: string
  productName: string
  type: 'entrada' | 'saida'
  quantity: number
  date: string
  time: string
  shift: 'Manhã' | 'Tarde' | 'Noite'
  responsibleDelivery: string
  responsibleWithdrawal: string
  location: string
}

export interface DailyStats {
  date: string
  shifts: {
    morning: number
    afternoon: number
    night: number
  }
  totalIn: number
  totalOut: number
}

// Dados iniciais de exemplo
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Bola de Futebol',
    category: 'Esportes',
    quantityTotal: 20,
    quantityMinimum: 5,
    quantityAcceptable: 15,
    currentQuantity: 18,
    location: 'Almoxarifado A',
  },
  {
    id: '2',
    name: 'Rede de Vôlei',
    category: 'Esportes',
    quantityTotal: 20,
    quantityMinimum: 5,
    quantityAcceptable: 15,
    currentQuantity: 12,
    location: 'Almoxarifado A',
  },
  {
    id: '3',
    name: 'Colchonete',
    category: 'Ginástica',
    quantityTotal: 20,
    quantityMinimum: 5,
    quantityAcceptable: 15,
    currentQuantity: 6,
    location: 'Almoxarifado B',
  },
  {
    id: '4',
    name: 'Halteres 5kg',
    category: 'Academia',
    quantityTotal: 20,
    quantityMinimum: 5,
    quantityAcceptable: 15,
    currentQuantity: 3,
    location: 'Almoxarifado B',
  },
  {
    id: '5',
    name: 'Raquete de Tênis',
    category: 'Esportes',
    quantityTotal: 20,
    quantityMinimum: 5,
    quantityAcceptable: 15,
    currentQuantity: 15,
    location: 'Almoxarifado A',
  },
]

const initialMovements: Movement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Bola de Futebol',
    type: 'saida',
    quantity: 2,
    date: '2026-06-05',
    time: '09:30',
    shift: 'Manhã',
    responsibleDelivery: 'João Silva',
    responsibleWithdrawal: 'Carlos Santos',
    location: 'Almoxarifado A',
  },
  {
    id: '2',
    productId: '2',
    productName: 'Rede de Vôlei',
    type: 'saida',
    quantity: 1,
    date: '2026-06-05',
    time: '14:15',
    shift: 'Tarde',
    responsibleDelivery: 'Maria Oliveira',
    responsibleWithdrawal: 'Ana Costa',
    location: 'Almoxarifado A',
  },
  {
    id: '3',
    productId: '3',
    productName: 'Colchonete',
    type: 'entrada',
    quantity: 5,
    date: '2026-06-05',
    time: '08:00',
    shift: 'Manhã',
    responsibleDelivery: 'Fornecedor X',
    responsibleWithdrawal: 'João Silva',
    location: 'Almoxarifado B',
  },
]

// Estado global em memória (simulando um banco de dados)
let products = [...initialProducts]
let movements = [...initialMovements]
let listeners: (() => void)[] = []

function notifyListeners() {
  listeners.forEach(listener => listener())
}

export function subscribeToChanges(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

export function getProducts(): Product[] {
  return [...products]
}

export function getMovements(): Movement[] {
  return [...movements]
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  }
  products = [...products, newProduct]
  notifyListeners()
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null
  
  products = products.map(p => 
    p.id === id ? { ...p, ...updates } : p
  )
  notifyListeners()
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const initialLength = products.length
  products = products.filter(p => p.id !== id)
  if (products.length !== initialLength) {
    notifyListeners()
    return true
  }
  return false
}

export function addMovement(movement: Omit<Movement, 'id'>): Movement {
  const newMovement: Movement = {
    ...movement,
    id: Date.now().toString(),
  }
  movements = [...movements, newMovement]
  
  // Atualizar quantidade do produto
  const product = products.find(p => p.id === movement.productId)
  if (product) {
    const newQuantity = movement.type === 'entrada'
      ? product.currentQuantity + movement.quantity
      : product.currentQuantity - movement.quantity
    
    updateProduct(product.id, { currentQuantity: Math.max(0, newQuantity) })
  }
  
  notifyListeners()
  return newMovement
}

export function getShift(time: string): 'Manhã' | 'Tarde' | 'Noite' {
  const hour = parseInt(time.split(':')[0])
  if (hour >= 6 && hour < 12) return 'Manhã'
  if (hour >= 12 && hour < 18) return 'Tarde'
  return 'Noite'
}

export function getDailyStats(date: string): DailyStats {
  const dayMovements = movements.filter(m => m.date === date)
  
  const stats: DailyStats = {
    date,
    shifts: {
      morning: 0,
      afternoon: 0,
      night: 0,
    },
    totalIn: 0,
    totalOut: 0,
  }
  
  dayMovements.forEach(m => {
    if (m.type === 'entrada') {
      stats.totalIn += m.quantity
    } else {
      stats.totalOut += m.quantity
    }
    
    if (m.shift === 'Manhã') {
      stats.shifts.morning += m.quantity
    } else if (m.shift === 'Tarde') {
      stats.shifts.afternoon += m.quantity
    } else {
      stats.shifts.night += m.quantity
    }
  })
  
  return stats
}

export function getMovementsByDate(date: string): Movement[] {
  return movements.filter(m => m.date === date)
}

export function getMovementsByShift(date: string, shift: 'Manhã' | 'Tarde' | 'Noite'): Movement[] {
  return movements.filter(m => m.date === date && m.shift === shift)
}

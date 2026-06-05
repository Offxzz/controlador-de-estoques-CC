'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  Product,
  Movement,
  getProducts,
  getMovements,
  addProduct as addProductToStore,
  updateProduct as updateProductInStore,
  deleteProduct as deleteProductFromStore,
  addMovement as addMovementToStore,
  subscribeToChanges,
  getDailyStats,
  DailyStats,
} from './store'

interface StoreContextType {
  products: Product[]
  movements: Movement[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addMovement: (movement: Omit<Movement, 'id'>) => void
  getDailyStats: (date: string) => DailyStats
  refreshData: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])

  const refreshData = useCallback(() => {
    setProducts(getProducts())
    setMovements(getMovements())
  }, [])

  useEffect(() => {
    refreshData()
    const unsubscribe = subscribeToChanges(refreshData)
    return unsubscribe
  }, [refreshData])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    addProductToStore(product)
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    updateProductInStore(id, updates)
  }, [])

  const deleteProduct = useCallback((id: string) => {
    deleteProductFromStore(id)
  }, [])

  const addMovement = useCallback((movement: Omit<Movement, 'id'>) => {
    addMovementToStore(movement)
  }, [])

  return (
    <StoreContext.Provider
      value={{
        products,
        movements,
        addProduct,
        updateProduct,
        deleteProduct,
        addMovement,
        getDailyStats,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider')
  }
  return context
}

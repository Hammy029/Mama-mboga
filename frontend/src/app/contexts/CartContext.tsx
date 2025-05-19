"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  farmerId: string
  farmerName: string
  image?: string
  unit: string // e.g., 'kg', 'bunch', 'piece'
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  cart: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      }

      // Add new item
      const updatedItems = [...state.items, action.payload]
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      }

    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

const CART_STORAGE_KEY = 'farmers_marketplace_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      const { items } = JSON.parse(savedCart)
      items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
      })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity: 1 },
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Custom hook to check if items are from the same farmer
export function useCartValidation() {
  const { cart } = useCart()

  const isSameFarmer = (farmerId: string): boolean => {
    if (cart.items.length === 0) return true
    return cart.items.every(item => item.farmerId === farmerId)
  }

  const getCurrentFarmerId = (): string | null => {
    if (cart.items.length === 0) return null
    return cart.items[0].farmerId
  }

  return { isSameFarmer, getCurrentFarmerId }
}
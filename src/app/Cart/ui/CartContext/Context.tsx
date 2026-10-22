"use client"

import { useContext, createContext, useState, type PropsWithChildren, useEffect } from "react"

interface ImageType {
  src: string;
  altText: string | null;
  width: number;
  height: number;
}

interface CartItem {
  // Uma linha por variante: "id" é o id da variante, para tamanhos não se misturarem.
  id: string
  variantId: string
  title: string
  variantTitle?: string
  image: ImageType
  price: string
  currencyCode: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  handleDeleteProduct: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  total: number
  AddItem: (item: Omit<CartItem, "quantity">) => void
}

const CartContext = createContext<CartContextType>({
  cart: [],
  handleDeleteProduct: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  updateQuantity: () => {},
  total: 0,
  AddItem: () => {},
})

export function CartProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart))
    } else {
      localStorage.removeItem("cart")
    }
  }, [cart])

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      return sum + Number(item.price ?? 0) * item.quantity
    }, 0)
    setTotal(newTotal)
  }, [cart])

  function AddItem(item: Omit<CartItem, "quantity">) {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (existingItem) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function increaseQuantity(id: string) {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  function decreaseQuantity(id: string) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      handleDeleteProduct(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  function handleDeleteProduct(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        AddItem,
        total,
        handleDeleteProduct,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

"use client"

import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DeliveryAddress {
  street: string
  city: string
  phone: string
  instructions: string
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: user?.address || '',
    city: '',
    phone: user?.phone || '',
    instructions: ''
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        deliveryAddress,
        totalAmount: cart.total
      }

      // Send order to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      // Clear cart and redirect to order confirmation
      clearCart()
      router.push('/orders/confirmation')
    } catch (error) {
      setError('Failed to process your order. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/checkout')
    return null
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some products to your cart to checkout</p>
          <Link 
            href="/products"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Delivery Information */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    required
                    className="mt-1 form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    required
                    className="mt-1 form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    required
                    className="mt-1 form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Instructions (optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={deliveryAddress.instructions}
                    onChange={handleAddressChange}
                    rows={3}
                    className="mt-1 form-input"
                    placeholder="Any special instructions for delivery"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      {item.image && (
                        <div className="flex-shrink-0 w-24 h-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-center object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">KES {item.price * item.quantity}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            From: {item.farmerName}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order totals */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Details
            </h2>
            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">KES {cart.total}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Delivery Fee</dt>
                  <dd className="font-medium text-gray-900">TBD</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Order Total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    KES {cart.total}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
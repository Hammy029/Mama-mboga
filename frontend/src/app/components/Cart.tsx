"use client"

import React from 'react'
import { useCart } from '../contexts/CartContext'
import Link from 'next/link'

interface CartProps {
  isDropdown?: boolean
}

export default function Cart({ isDropdown = false }: CartProps) {
  const { cart, removeItem, updateQuantity } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className={`text-center p-4 ${isDropdown ? 'w-72' : 'w-full'}`}>
        <p className="text-gray-500">Your cart is empty</p>
        <Link
          href="/products"
          className="text-green-600 hover:text-green-700 font-medium inline-block mt-2"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className={`${isDropdown ? 'w-96' : 'w-full'}`}>
      <div className={`${isDropdown ? 'max-h-96 overflow-y-auto' : ''}`}>
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 border-b border-gray-200"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h4>
              <p className="text-sm text-gray-500">
                From: {item.farmerName}
              </p>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Decrease quantity</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="mx-2 text-gray-700">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Increase quantity</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <span className="sr-only">Remove item</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                KES {item.price * item.quantity}
              </p>
              <p className="text-xs text-gray-500">
                KES {item.price} / {item.unit}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total</span>
          <span className="font-medium">KES {cart.total}</span>
        </div>
        {!isDropdown && (
          <Link
            href="/checkout"
            className="w-full block text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        )}
        {isDropdown && (
          <div className="space-y-2">
            <Link
              href="/cart"
              className="block text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="block text-center border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import Cart from '../components/Cart'
import Link from 'next/link'

export default function CartPage() {
  const { cart } = useCart()
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow-sm rounded-lg">
            <Cart isDropdown={false} />
          </div>

          {cart.items.length > 0 && (
            <div className="mt-4">
              <Link
                href="/products"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Order summary */}
        {cart.items.length > 0 && (
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">
                      KES {cart.total}
                    </dd>
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

              {isAuthenticated ? (
                <Link
                  href="/checkout"
                  className="mt-6 block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="mt-6 space-y-4">
                  <Link
                    href="/auth/login?redirect=/checkout"
                    className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Login to Checkout
                  </Link>
                  <p className="text-sm text-center text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/auth/register?redirect=/checkout"
                      className="text-green-600 hover:text-green-500"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Need help?{' '}
                  <Link href="/contact" className="text-green-600 hover:text-green-500">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>

            {/* Delivery information */}
            <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Delivery Information
              </h3>
              <div className="text-sm text-gray-500 space-y-2">
                <p>• Orders are typically delivered within 24 hours</p>
                <p>• Free delivery for orders above KES 2,000</p>
                <p>• Delivery fee varies based on location</p>
                <p>• Track your order status in real-time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
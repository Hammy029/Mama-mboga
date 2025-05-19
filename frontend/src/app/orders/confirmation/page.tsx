"use client"

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function OrderConfirmationPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="rounded-full bg-green-100 h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. We&apos;ll send you a confirmation email with your order details.
        </p>

        {/* Order Summary */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            What happens next?
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <span className="text-green-600 font-medium">1</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">
                  Order Processing
                </h3>
                <p className="text-sm text-gray-500">
                  The farmer will review and accept your order
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <span className="text-green-600 font-medium">2</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">
                  Order Preparation
                </h3>
                <p className="text-sm text-gray-500">
                  Your products will be carefully prepared and packaged
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <span className="text-green-600 font-medium">3</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">
                  Delivery
                </h3>
                <p className="text-sm text-gray-500">
                  Your order will be delivered to your specified address
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            href="/orders"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Track Your Order
          </Link>
          <Link
            href="/products"
            className="inline-block border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help?{' '}
          <Link href="/contact" className="text-green-600 hover:text-green-500">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  )
}
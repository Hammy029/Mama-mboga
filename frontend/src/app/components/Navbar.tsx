"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import CartDropdown from './CartDropdown'

type NavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

const NavLink = ({ href, children, className = '' }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link 
      href={href}
      className={`${className} ${
        isActive 
          ? 'text-green-400' 
          : 'text-white hover:text-green-300'
      } transition-colors`}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Farmers Marketplace" 
                className="h-8 w-8 mr-2"
              />
              <span className="text-white text-lg font-semibold">
                Farmers Market
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>

            {/* Farmer specific links */}
            {isAuthenticated && user?.role === 'FARMER' && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/products/manage">Manage Products</NavLink>
                <NavLink href="/orders/received">Orders</NavLink>
              </>
            )}

            {/* Customer specific links */}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <>
                <NavLink href="/orders">My Orders</NavLink>
              </>
            )}

            {/* Admin specific links */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <NavLink href="/admin/dashboard">Admin Dashboard</NavLink>
                <NavLink href="/admin/users">Manage Users</NavLink>
              </>
            )}

            {/* Cart Dropdown (show for everyone) */}
            <CartDropdown />

            {/* Authentication links */}
            {!isAuthenticated ? (
              <>
                <NavLink href="/auth/login" className="ml-4">Login</NavLink>
                <NavLink 
                  href="/auth/register"
                  className="ml-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center ml-4">
                <span className="text-white mr-4">
                  Welcome, {user?.name ?? 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-green-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <CartDropdown />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/" className="block px-3 py-2">Home</NavLink>
            <NavLink href="/products" className="block px-3 py-2">Products</NavLink>

            {/* Farmer specific links */}
            {isAuthenticated && user?.role === 'FARMER' && (
              <>
                <NavLink href="/dashboard" className="block px-3 py-2">Dashboard</NavLink>
                <NavLink href="/products/manage" className="block px-3 py-2">Manage Products</NavLink>
                <NavLink href="/orders/received" className="block px-3 py-2">Orders</NavLink>
              </>
            )}

            {/* Customer specific links */}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <>
                <NavLink href="/orders" className="block px-3 py-2">My Orders</NavLink>
                <NavLink href="/cart" className="block px-3 py-2">Cart</NavLink>
              </>
            )}

            {/* Admin specific links */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <NavLink href="/admin/dashboard" className="block px-3 py-2">Admin Dashboard</NavLink>
                <NavLink href="/admin/users" className="block px-3 py-2">Manage Users</NavLink>
              </>
            )}

            {/* Authentication links */}
            {!isAuthenticated ? (
              <div className="px-3 py-2">
                <NavLink href="/auth/login" className="block mb-2">Login</NavLink>
                <NavLink 
                  href="/auth/register"
                  className="block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center"
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="px-3 py-2">
                <span className="block text-white mb-2">Welcome, {user?.name ?? 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:text-green-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
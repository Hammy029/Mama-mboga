import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fresh Farm Products Direct to Your Door
            </h1>
            <p className="text-xl mb-8">
              Connect directly with local farmers and get fresh, quality produce at the best prices
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/register?role=CUSTOMER"
                className="btn-primary text-lg"
              >
                Start Shopping
              </Link>
              <Link
                href="/auth/register?role=FARMER"
                className="px-6 py-3 bg-white text-green-700 rounded-md hover:bg-green-50 transition-colors duration-200"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Our Marketplace?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Prices</h3>
              <p className="text-gray-600">
                Direct from farmers means better prices for everyone
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Fresh, high-quality produce verified by our team
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery to ensure maximum freshness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                For Customers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Browse Products</h4>
                    <p className="text-gray-600">
                      Explore our wide selection of fresh farm products
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Place Your Order</h4>
                    <p className="text-gray-600">
                      Select your items and choose delivery options
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Receive Fresh Products</h4>
                    <p className="text-gray-600">
                      Get your fresh products delivered to your doorstep
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Farmers */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                For Farmers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">List Your Products</h4>
                    <p className="text-gray-600">
                      Easily add your products and set your prices
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Receive Orders</h4>
                    <p className="text-gray-600">
                      Get notified when customers place orders
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Fulfill & Earn</h4>
                    <p className="text-gray-600">
                      Prepare orders and earn direct payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Join Our Marketplace?
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/register?role=CUSTOMER"
              className="px-6 py-3 bg-white text-green-700 rounded-md hover:bg-green-50 transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/auth/register?role=FARMER"
              className="px-6 py-3 border-2 border-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
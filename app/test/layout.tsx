import Link from 'next/link';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Test Route Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Back to App
              </Link>
              <span className="mx-4 text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Integration Tests
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/test/world"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                World ID
              </Link>
              <Link
                href="/test/ledger"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Ledger
              </Link>
              <Link
                href="/test/walrus"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Walrus
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Test Route Content */}
      <main>{children}</main>

      {/* Test Environment Notice */}
      <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-700 rounded-lg p-3 max-w-xs">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          🧪 Test Environment - Not for production use
        </p>
      </div>
    </div>
  );
}
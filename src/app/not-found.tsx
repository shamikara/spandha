import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wedding-cream dark:bg-wedding-dark px-4">
      <div className="wedding-card p-8 text-center max-w-md w-full">
        <h2 className="text-6xl font-serif font-bold text-wedding-gold mb-4">
          404
        </h2>
        <h3 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-gray-200 mb-4">
          Page Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="wedding-button inline-flex items-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

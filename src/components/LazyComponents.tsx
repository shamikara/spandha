// Dynamic imports for performance optimization
import dynamic from 'next/dynamic'

// Heavy components that should be loaded on demand
export const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />,
  ssr: false,
})

export const Stats = dynamic(() => import('@/components/Stats'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />,
  ssr: false,
})

export const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />,
  ssr: false,
})

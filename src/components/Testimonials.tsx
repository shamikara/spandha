export default function Testimonials() {
  const testimonials = [
    {
      name: "Anusha & Priyanka",
      location: "Colombo",
      content: "We found each other through Spandha and got married last year. The platform made it easy to connect with verified profiles. Thank you for bringing us together!",
      avatar: "AP"
    },
    {
      name: "Ravindra & Nadeesha",
      location: "Kandy", 
      content: "After trying many platforms, Spandha was the only one that felt genuine. The verification process gave us confidence, and we're now happily married.",
      avatar: "RN"
    },
    {
      name: "Chamara & Dilini",
      location: "Galle",
      content: "Spandha helped us find our perfect match despite being from different cities. The platform is secure, user-friendly, and truly focused on meaningful connections.",
      avatar: "CD"
    }
  ]

  return (
    <section className="py-20 bg-wedding-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from couples who found their perfect match through Spandha
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="wedding-card p-6 relative hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute -top-4 left-6">
                <div className="w-12 h-12 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold">
                  {testimonial.avatar}
                </div>
              </div>
              
              <div className="mt-4 mb-4">
                <svg className="w-8 h-8 text-wedding-maroon/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="border-t border-wedding-maroon/20 pt-4">
                <div className="font-semibold text-wedding-maroon dark:text-wedding-gold">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

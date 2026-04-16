export default function Stats() {
  const stats = [
    { number: "50,000+", label: "Active Users", description: "Trusted members across Sri Lanka" },
    { number: "2,500+", label: "Successful Marriages", description: "Happy couples found through Spandha" },
    { number: "15+", label: "Years of Service", description: "Dedicated to bringing hearts together" },
    { number: "99.9%", label: "Safety Rate", description: "Committed to your security" }
  ]

  return (
    <section className="py-20 wedding-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join Sri Lanka's largest and most trusted matrimonial community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-wedding-gold mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-white/80 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

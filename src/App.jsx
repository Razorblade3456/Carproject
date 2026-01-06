import './App.css'

function App() {
  const options = [
    {
      label: 'Sedan',
      description: 'Sleek lines, quiet cabins, and nimble city handling.',
      badge: 'Smooth & Efficient',
      icon: '🚗'
    },
    {
      label: 'Truck',
      description: 'Built for payloads, weekend toys, and endless adventures.',
      badge: 'Strength & Utility',
      icon: '🛻'
    },
    {
      label: 'SUV',
      description: 'Spacious interiors with confident, all-weather versatility.',
      badge: 'Comfort & Control',
      icon: '🚙'
    }
  ]

  return (
    <main className="page">
      <div className="background-glow background-glow--left" />
      <div className="background-glow background-glow--right" />

      <section className="hero">
        <p className="eyebrow">Welcome to your next drive</p>
        <h1>
          Choose your
          <span className="highlight"> perfect fit</span>
        </h1>
        <p className="lede">
          Explore the lineup and start with the category that matches your lifestyle.
          Each option is crafted with comfort, capability, and style in mind.
        </p>

        <div className="options-grid">
          {options.map((option) => (
            <button key={option.label} className="option-card" type="button">
              <span className="option-icon" aria-hidden>
                {option.icon}
              </span>
              <div className="option-content">
                <div className="option-header">
                  <h2>{option.label}</h2>
                  <span className="badge">{option.badge}</span>
                </div>
                <p>{option.description}</p>
              </div>
              <span className="option-arrow" aria-hidden>
                →
              </span>
            </button>
          ))}
        </div>

        <div className="footnote">
          <span className="dot" aria-hidden />
          Start with a category to view trims, colors, and feature packs tailored to you.
        </div>
      </section>
    </main>
  )
}

export default App

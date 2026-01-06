import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const options = [
    {
      label: 'Sedan',
      model: 'Aurora S3',
      description: 'Sleek lines, quiet cabins, and nimble city handling.',
      badge: 'Smooth & Efficient',
      icon: '🚗',
      colors: [
        { name: 'Midnight', hex: '#0f172a' },
        { name: 'Glacier', hex: '#dfe7f5' },
        { name: 'Cinder', hex: '#2f343d' },
        { name: 'Solar Flare', hex: '#ff8d5c' }
      ]
    },
    {
      label: 'Truck',
      model: 'RidgeLine X',
      description: 'Built for payloads, weekend toys, and endless adventures.',
      badge: 'Strength & Utility',
      icon: '🛻',
      colors: [
        { name: 'Canyon Red', hex: '#a02828' },
        { name: 'Summit White', hex: '#f7f8fb' },
        { name: 'Ironclad', hex: '#373a42' },
        { name: 'Desert Tan', hex: '#c0a074' }
      ]
    },
    {
      label: 'SUV',
      model: 'Atlas E7',
      description: 'Spacious interiors with confident, all-weather versatility.',
      badge: 'Comfort & Control',
      icon: '🚙',
      colors: [
        { name: 'Evergreen', hex: '#1d4d3c' },
        { name: 'Lunar Mist', hex: '#cad6e8' },
        { name: 'Graphite', hex: '#2d3038' },
        { name: 'Harbor Blue', hex: '#5d7ea6' }
      ]
    }
  ]

  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  const modelTone = useMemo(() => {
    if (!selectedColor) return 'linear-gradient(135deg, #2a2e38, #171b23)'
    const transparent = `${selectedColor}30`
    return `radial-gradient(circle at 20% 20%, ${transparent}, transparent 45%), linear-gradient(135deg, ${selectedColor}, #0c0f15)`
  }, [selectedColor])

  const handleSelect = (option) => {
    setSelectedOption(option)
    setSelectedColor(option.colors[0].hex)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setSelectedColor(null)
  }

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

        {!selectedOption ? (
          <div className="options-grid">
            {options.map((option) => (
              <button
                key={option.label}
                className="option-card"
                type="button"
                onClick={() => handleSelect(option)}
              >
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
        ) : (
          <div className="model-section">
            <div className="model-panel" style={{ backgroundImage: modelTone }}>
              <div className="model-glow" />
              <div className="model-meta">
                <div className="pill">Selected · {selectedOption.label}</div>
                <h2 className="model-name">{selectedOption.model}</h2>
                <p className="model-description">{selectedOption.description}</p>
              </div>

              <div className="model-visual">
                <div className="model-icon" aria-hidden>
                  {selectedOption.icon}
                </div>
                <div className="model-overlay" />
                <div className="model-ring" />
              </div>

              <div className="palette">
                <span className="palette-label">Choose a color</span>
                <div className="swatches">
                  {selectedOption.colors.map((color) => (
                    <button
                      key={color.hex}
                      className={`swatch ${selectedColor === color.hex ? 'is-active' : ''}`}
                      type="button"
                      style={{ backgroundColor: color.hex }}
                      aria-label={`${color.name} color`}
                      onClick={() => setSelectedColor(color.hex)}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="footnote">
              <span className="dot" aria-hidden />
              Start customizing your {selectedOption.label.toLowerCase()} or{' '}
              <button className="link-button" type="button" onClick={handleReset}>
                choose a different category
              </button>
              .
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default App

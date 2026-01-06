import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'

function App() {
  const options = [
    {
      label: 'Sedan',
      model: 'Aurora S3',
      description: 'Sleek lines, quiet cabins, and nimble city handling.',
      badge: 'Smooth & Efficient',
      icon: '🚗',
      parts: [
        { name: 'Engine Oil', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Oil Filter', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Brake Pads', interval: '30,000–70,000 miles (2–5 years)' },
        { name: 'Brake Rotors', interval: '60,000–100,000 miles (4–7 years)' },
        { name: 'Tires', interval: '40,000–60,000 miles (3–5 years)' },
        { name: 'Battery', interval: '3–5 years' },
        { name: 'Engine Air Filter', interval: '12,000–20,000 miles (1–2 years)' },
        { name: 'Cabin Air Filter', interval: '15,000–30,000 miles (1–2 years)' },
        { name: 'Spark Plugs', interval: '60,000–100,000 miles (4–7 years)' },
        { name: 'Transmission Fluid', interval: '60,000–100,000 miles (4–7 years)' }
      ],
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
      parts: [
        { name: 'Engine Oil', interval: 'TBD' },
        { name: 'Oil Filter', interval: 'TBD' },
        { name: 'Brake Pads', interval: 'TBD' },
        { name: 'Brake Rotors', interval: 'TBD' },
        { name: 'Tires', interval: 'TBD' },
        { name: 'Battery', interval: 'TBD' },
        { name: 'Engine Air Filter', interval: 'TBD' },
        { name: 'Cabin Air Filter', interval: 'TBD' },
        { name: 'Spark Plugs', interval: 'TBD' },
        { name: 'Transmission Fluid', interval: 'TBD' },
        { name: 'Differential Fluid', interval: 'TBD' },
        { name: 'Suspension Components', interval: 'TBD' }
      ],
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
      parts: [
        { name: 'Engine Oil', interval: 'TBD' },
        { name: 'Oil Filter', interval: 'TBD' },
        { name: 'Brake Pads', interval: 'TBD' },
        { name: 'Brake Rotors', interval: 'TBD' },
        { name: 'Tires', interval: 'TBD' },
        { name: 'Battery', interval: 'TBD' },
        { name: 'Engine Air Filter', interval: 'TBD' },
        { name: 'Cabin Air Filter', interval: 'TBD' },
        { name: 'Spark Plugs', interval: 'TBD' },
        { name: 'Transmission Fluid', interval: 'TBD' },
        { name: 'Suspension (Shocks / Struts)', interval: 'TBD' }
      ],
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
  const [vehicleName, setVehicleName] = useState('')

  const handleSelect = (option) => {
    setSelectedOption(option)
    setSelectedColor(option.colors[0].hex)
    setVehicleName(option.model)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setSelectedColor(null)
    setVehicleName('')
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
          <div className="model-section reveal">
            <div className="model-panel">
              <div className="model-glow" />
              <div className="model-meta">
                <div className="pill">Selected · {selectedOption.label}</div>
                <h2 className="model-name">{vehicleName || selectedOption.model}</h2>
                <p className="model-description">{selectedOption.description}</p>
              </div>

              <div className="model-visual">
                <Suspense fallback={<div className="model-fallback">Loading model...</div>}>
                  <Canvas camera={{ position: [0, 1.1, 3.2], fov: 42 }}>
                    <color attach="background" args={['#0f1115']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2.5, 3, 2]} intensity={1.2} />
                    <spotLight position={[-2, 3, -2]} angle={0.45} intensity={0.6} />
                    <VehicleModel type={selectedOption.label} color={selectedColor} />
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 1.7}
                    />
                  </Canvas>
                </Suspense>
              </div>

              <label className="name-field">
                <span>Name your vehicle</span>
                <input
                  type="text"
                  value={vehicleName}
                  placeholder="e.g., Midnight Cruiser"
                  onChange={(e) => setVehicleName(e.target.value)}
                />
              </label>

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

              <div className="parts-card">
                <div className="parts-header">
                  <h3>Key parts</h3>
                  <span className="badge subtle">Maintenance</span>
                </div>
                <div className="parts-grid">
                  {selectedOption.parts && selectedOption.parts.length > 0 ? (
                    selectedOption.parts.map((part) => (
                      <div key={part.name} className="part-chip">
                        <div className="part-name">{part.name}</div>
                        <div className="part-interval">{part.interval || 'Mileage coming soon'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="part-chip">
                      <div className="part-name">Parts list coming soon</div>
                    </div>
                  )}
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

function VehicleModel({ type, color }) {
  const bodyColor = color || '#6ba6ff'

  const bodyProps = (() => {
    switch (type) {
      case 'Truck':
        return {
          body: { position: [0, 0.55, 0], args: [2.4, 0.5, 1] },
          roof: { position: [0.3, 0.95, 0], args: [1.4, 0.35, 1] },
          bed: { position: [-0.75, 0.65, 0], args: [0.8, 0.42, 1] },
          windows: { position: [0.25, 0.95, 0], args: [1.35, 0.32, 0.82] },
          wheels: [
            [-1.15, 0.1, 0.65],
            [1.15, 0.1, 0.65],
            [1.15, 0.1, -0.65],
            [-1.15, 0.1, -0.65]
          ]
        }
      case 'SUV':
        return {
          body: { position: [0, 0.58, 0], args: [2.1, 0.55, 1.05] },
          roof: { position: [0, 1.05, 0], args: [1.5, 0.35, 0.95] },
          windows: { position: [0, 1.0, 0], args: [1.3, 0.32, 0.85] },
          wheels: [
            [-1, 0.1, 0.65],
            [1, 0.1, 0.65],
            [1, 0.1, -0.65],
            [-1, 0.1, -0.65]
          ]
        }
      default:
        return {
          body: { position: [0, 0.52, 0], args: [2.2, 0.45, 0.9] },
          roof: { position: [0.1, 0.9, 0], args: [1.4, 0.32, 0.8] },
          windows: { position: [0.08, 0.86, 0], args: [1.25, 0.3, 0.72] },
          wheels: [
            [-1.05, 0.1, 0.62],
            [1.05, 0.1, 0.62],
            [1.05, 0.1, -0.62],
            [-1.05, 0.1, -0.62]
          ]
        }
    }
  })()

  const Wheel = ({ position }) => (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.24, 0.24, 0.28, 24]} />
      <meshStandardMaterial color="#1a1a1d" roughness={0.45} metalness={0.1} />
    </mesh>
  )

  return (
    <group>
      <mesh position={bodyProps.body.position} castShadow receiveShadow>
        <boxGeometry args={bodyProps.body.args} />
        <meshStandardMaterial color={bodyColor} roughness={0.32} metalness={0.45} />
      </mesh>

      <mesh position={bodyProps.roof.position} castShadow receiveShadow>
        <boxGeometry args={bodyProps.roof.args} />
        <meshStandardMaterial color={bodyColor} roughness={0.28} metalness={0.5} />
      </mesh>

      {bodyProps.windows ? (
        <mesh position={bodyProps.windows.position} castShadow>
          <boxGeometry args={bodyProps.windows.args} />
          <meshStandardMaterial
            color="#9eb7d8"
            roughness={0.08}
            metalness={0.6}
            transparent
            opacity={0.92}
          />
        </mesh>
      ) : null}

      {bodyProps.bed ? (
        <mesh position={bodyProps.bed.position} castShadow receiveShadow>
          <boxGeometry args={bodyProps.bed.args} />
          <meshStandardMaterial color={bodyColor} roughness={0.34} metalness={0.4} />
        </mesh>
      ) : null}

      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.4, 48]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.9} metalness={0.05} />
      </mesh>

      <mesh position={[0, 0.62, -0.52]} castShadow>
        <boxGeometry args={[1.2, 0.18, 0.06]} />
        <meshStandardMaterial color="#dfe7f5" emissive="#9fb5da" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0.52]} castShadow>
        <boxGeometry args={[1.2, 0.18, 0.06]} />
        <meshStandardMaterial color="#ffd8a6" emissive="#ffb76b" emissiveIntensity={0.3} />
      </mesh>

      {bodyProps.wheels.map((coords, idx) => (
        <Wheel key={`${coords.join('-')}-${idx}`} position={coords} />
      ))}
    </group>
  )
}

export default App

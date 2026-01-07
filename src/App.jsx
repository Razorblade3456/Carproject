import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'

function App() {
  const options = [
    {
      label: 'Sedan',
      model: 'Aurora S3',
      description: 'Quiet cabin. Sharp handling. Easy city moves.',
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
        { name: 'Electric Blue', hex: '#1e88ff' },
        { name: 'Midnight', hex: '#0f172a' },
        { name: 'Glacier', hex: '#dfe7f5' },
        { name: 'Cinder', hex: '#2f343d' },
        { name: 'Solar Flare', hex: '#ff8d5c' }
      ]
    },
    {
      label: 'Truck',
      model: 'RidgeLine X',
      description: 'Built for payloads and weekend missions.',
      badge: 'Strength & Utility',
      icon: '🛻',
      parts: [
        { name: 'Engine Oil', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Oil Filter', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Brake Pads', interval: '25,000–50,000 miles (2–4 years)' },
        { name: 'Brake Rotors', interval: '50,000–80,000 miles (3–5 years)' },
        { name: 'Tires', interval: '30,000–50,000 miles (2–4 years)' },
        { name: 'Battery', interval: '3–5 years' },
        { name: 'Engine Air Filter', interval: '10,000–20,000 miles (1–2 years)' },
        { name: 'Cabin Air Filter', interval: '15,000–30,000 miles (1–2 years)' },
        { name: 'Spark Plugs', interval: '60,000–100,000 miles (4–7 years)' },
        { name: 'Transmission Fluid', interval: '40,000–80,000 miles (3–5 years)' },
        { name: 'Differential Fluid', interval: '30,000–60,000 miles (2–4 years)' },
        { name: 'Suspension Components', interval: '50,000–100,000 miles (3–7 years)' }
      ],
      colors: [
        { name: 'Electric Blue', hex: '#1e88ff' },
        { name: 'Canyon Red', hex: '#a02828' },
        { name: 'Summit White', hex: '#f7f8fb' },
        { name: 'Ironclad', hex: '#373a42' },
        { name: 'Desert Tan', hex: '#c0a074' }
      ]
    },
    {
      label: 'SUV',
      model: 'Atlas E7',
      description: 'Spacious, calm, and ready for any weather.',
      badge: 'Comfort & Control',
      icon: '🚙',
      parts: [
        { name: 'Engine Oil', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Oil Filter', interval: '5,000–7,500 miles (6–9 months)' },
        { name: 'Brake Pads', interval: '30,000–60,000 miles (2–4 years)' },
        { name: 'Brake Rotors', interval: '60,000–90,000 miles (4–6 years)' },
        { name: 'Tires', interval: '35,000–55,000 miles (3–4 years)' },
        { name: 'Battery', interval: '3–5 years' },
        { name: 'Engine Air Filter', interval: '12,000–20,000 miles (1–2 years)' },
        { name: 'Cabin Air Filter', interval: '15,000–30,000 miles (1–2 years)' },
        { name: 'Spark Plugs', interval: '60,000–100,000 miles (4–7 years)' },
        { name: 'Transmission Fluid', interval: '50,000–90,000 miles (4–6 years)' },
        { name: 'Suspension (shocks/struts)', interval: '60,000–100,000 miles (4–7 years)' }
      ],
      colors: [
        { name: 'Electric Blue', hex: '#1e88ff' },
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
  const [partName, setPartName] = useState('')
  const [partAge, setPartAge] = useState('')
  const [partAgeUnit, setPartAgeUnit] = useState('months')

  const handleSelect = (option) => {
    setSelectedOption(option)
    setSelectedColor(option.colors[0].hex)
    setVehicleName(option.model)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setSelectedColor(null)
    setVehicleName('')
    setPartName('')
    setPartAge('')
    setPartAgeUnit('months')
  }

  return (
    <main className="page">
      <div className="background-glow background-glow--left" />
      <div className="background-glow background-glow--right" />

      <section className="hero">
        <p className="eyebrow">Next drive, unlocked</p>
        <h1>
          Choose your
          <span className="highlight"> perfect fit</span>
        </h1>
        <p className="lede">
          Pick a category. Tune the vibe. Keep the journey smooth.
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
                      <div key={part.name} className="part-chip" role="button" tabIndex={0}>
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

                <div className="parts-card maintenance-card">
                  <div className="parts-header">
                    <h3>Part age tracker</h3>
                    <span className="badge subtle">Log</span>
                  </div>
                  <p className="card-note">Track the age of any part for quick upkeep.</p>
                  <div className="tracker-grid">
                    <label className="name-field">
                      <span>Part name</span>
                      <input
                        type="text"
                        value={partName}
                        placeholder="e.g., Battery"
                        onChange={(e) => setPartName(e.target.value)}
                      />
                    </label>
                    <label className="name-field">
                      <span>Age</span>
                      <input
                        type="number"
                        min="0"
                        value={partAge}
                        placeholder="0"
                        onChange={(e) => setPartAge(e.target.value)}
                      />
                    </label>
                    <label className="name-field">
                      <span>Unit</span>
                      <select value={partAgeUnit} onChange={(e) => setPartAgeUnit(e.target.value)}>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </label>
                  </div>
                  <div className="tracker-summary">
                    <span className="tracker-dot" aria-hidden />
                    {partName && partAge ? (
                      <span>
                        Tracking {partName} · {partAge} {partAgeUnit}
                      </span>
                    ) : (
                      <span>Enter a part and age to start tracking.</span>
                    )}
                  </div>
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
  const bodyColor = color || '#1e88ff'

  const transform = useMemo(() => {
    switch (type) {
      case 'Truck':
        return { scale: 1, rotation: [0, Math.PI / 14, 0], position: [0, -0.3, 0] }
      case 'SUV':
        return { scale: 1, rotation: [0, Math.PI / 16, 0], position: [0, -0.32, 0] }
      default:
        return { scale: 1, rotation: [0, Math.PI / 18, 0], position: [0, -0.28, 0] }
    }
  }, [type])

  const roofOffset = type === 'Truck' ? 0.1 : 0.18
  const bedLength = type === 'Truck' ? 0.4 : 0
  const rearOverhang = type === 'SUV' ? 0.05 : 0

  return (
    <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      {/* Main body */}
      <mesh position={[0, 0, rearOverhang / 2]}>
        <boxGeometry args={[1.8, 0.35, 0.9 + rearOverhang]} />
        <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Roof / cabin */}
      <mesh position={[0, 0.3 + roofOffset, 0]}>
        <boxGeometry args={[1.1 + bedLength, 0.35, 0.8]} />
        <meshStandardMaterial color={bodyColor} metalness={0.15} roughness={0.4} />
      </mesh>

      {/* Cabin glass */}
      <mesh position={[0, 0.3 + roofOffset, 0]}>
        <boxGeometry args={[1.05, 0.28, 0.75]} />
        <meshStandardMaterial color="#5fa7ff" metalness={0.4} roughness={0.2} transparent opacity={0.75} />
      </mesh>

      {/* Truck bed */}
      {type === 'Truck' && (
        <mesh position={[0.55, 0.05, 0]}>
          <boxGeometry args={[0.7, 0.35, 0.92]} />
          <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.45} />
        </mesh>
      )}

      {/* Wheels */}
      {[
        [-0.65, -0.25, 0.55],
        [0.65, -0.25, 0.55],
        [-0.65, -0.25, -0.55],
        [0.65, -0.25, -0.55],
      ].map((pos) => (
        <Wheel key={pos.join('-')} position={pos} />
      ))}

      {/* Headlights */}
      <mesh position={[-0.95, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.12, 0.22]} />
        <meshStandardMaterial emissive="#cde6ff" emissiveIntensity={2} color="#cde6ff" />
      </mesh>
      <mesh position={[-0.95, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.12, 0.22]} />
        <meshStandardMaterial emissive="#cde6ff" emissiveIntensity={2} color="#cde6ff" />
      </mesh>

      {/* Taillights */}
      <mesh position={[0.95 + bedLength / 2, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.12, 0.22]} />
        <meshStandardMaterial emissive="#ff5555" emissiveIntensity={1.4} color="#ff7777" />
      </mesh>
      <mesh position={[0.95 + bedLength / 2, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.12, 0.22]} />
        <meshStandardMaterial emissive="#ff5555" emissiveIntensity={1.4} color="#ff7777" />
      </mesh>
    </group>
  )
}

function Wheel({ position }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 24]} />
        <meshStandardMaterial color="#0b0d11" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.26, 16]} />
        <meshStandardMaterial color="#d9e3f5" roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  )
}

export default App

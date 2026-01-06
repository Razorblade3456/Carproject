import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Color } from 'three'
import './App.css'

function App() {
  const options = [
    {
      label: 'Sedan',
      model: 'Aurora S3',
      description: 'Sleek lines, quiet cabins, and nimble city handling.',
      badge: 'Smooth & Efficient',
      icon: '🚗',
      modelUrl: '/models/sedan.glb',
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
        { name: 'Turquoise', hex: '#23c9c9' },
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
      modelUrl: '/models/truck.glb',
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
        { name: 'Turquoise', hex: '#23c9c9' },
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
      modelUrl: '/models/jeep_compass_2022_lowpoly.glb',
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
        { name: 'Turquoise', hex: '#23c9c9' },
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
                    <VehicleModel
                      type={selectedOption.label}
                      color={selectedColor}
                      modelUrl={selectedOption.modelUrl}
                    />
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

function VehicleModel({ type, color, modelUrl }) {
  const bodyColor = color || '#23c9c9'

  const transform = useMemo(() => {
    switch (type) {
      case 'Truck':
        return { scale: 0.85, rotation: [0, Math.PI / 8, 0], position: [0, -0.3, 0] }
      case 'SUV':
        return { scale: 0.9, rotation: [0, Math.PI / 10, 0], position: [0, -0.32, 0] }
      default:
        return { scale: 0.92, rotation: [0, Math.PI / 12, 0], position: [0, -0.32, 0] }
    }
  }, [type])

  const { scene } = useGLTF(modelUrl || '/models/sedan.glb')
  const paintedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    paintedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material
        if (mat.color) mat.color = new Color(bodyColor)
        if (mat.emissive) mat.emissive = new Color(bodyColor).multiplyScalar(0.12)
        mat.needsUpdate = true
      }
    })
  }, [paintedScene, bodyColor])

  return (
    <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <primitive object={paintedScene} />
    </group>
  )
}

export default App

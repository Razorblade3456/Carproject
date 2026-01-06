import { Suspense, useMemo, useState } from 'react'
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
          <div className="model-section reveal">
            <div className="model-panel">
              <div className="model-glow" />
              <div className="model-meta">
                <div className="pill">Selected · {selectedOption.label}</div>
                <h2 className="model-name">{selectedOption.model}</h2>
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

function VehicleModel({ type, color }) {
  const bodyColor = color || '#6ba6ff'

  const bodyProps = useMemo(() => {
    switch (type) {
      case 'Truck':
        return {
          body: { position: [0, 0.35, 0], args: [2.4, 0.5, 1] },
          roof: { position: [0.3, 0.75, 0], args: [1.4, 0.35, 1] },
          bed: { position: [-0.75, 0.45, 0], args: [0.8, 0.42, 1] },
          wheels: [
            [-1.15, -0.25, 0.65],
            [1.15, -0.25, 0.65],
            [1.15, -0.25, -0.65],
            [-1.15, -0.25, -0.65]
          ]
        }
      case 'SUV':
        return {
          body: { position: [0, 0.38, 0], args: [2.1, 0.55, 1.05] },
          roof: { position: [0, 0.85, 0], args: [1.5, 0.35, 0.95] },
          wheels: [
            [-1, -0.25, 0.65],
            [1, -0.25, 0.65],
            [1, -0.25, -0.65],
            [-1, -0.25, -0.65]
          ]
        }
      default:
        return {
          body: { position: [0, 0.32, 0], args: [2.2, 0.45, 0.9] },
          roof: { position: [0.1, 0.7, 0], args: [1.4, 0.32, 0.8] },
          wheels: [
            [-1.05, -0.25, 0.62],
            [1.05, -0.25, 0.62],
            [1.05, -0.25, -0.62],
            [-1.05, -0.25, -0.62]
          ]
        }
    }
  }, [type])

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

      {bodyProps.bed ? (
        <mesh position={bodyProps.bed.position} castShadow receiveShadow>
          <boxGeometry args={bodyProps.bed.args} />
          <meshStandardMaterial color={bodyColor} roughness={0.34} metalness={0.4} />
        </mesh>
      ) : null}

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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

import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'

function App() {
  const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
  const STORAGE_USER_KEY = 'carproject-google-user'
  const STORAGE_DATA_PREFIX = 'carproject-user-data-'
  const options = [
    {
      label: 'Sedan',
      model: 'Aurora S3',
      description: 'Keep daily-driver parts on a clean maintenance cadence.',
      badge: 'Daily Maintenance',
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
        { name: 'Solar Flare', hex: '#ff8d5c' },
        { name: 'Sunrise Gold', hex: '#f4b63a' },
        { name: 'Deep Plum', hex: '#5b3b6b' },
        { name: 'Pearl White', hex: '#f9fafc' }
      ]
    }
  ]

  const [partName, setPartName] = useState('')
  const [partExpiryDate, setPartExpiryDate] = useState('')
  const [isNightMode, setIsNightMode] = useState(false)
  const [googleUser, setGoogleUser] = useState(null)
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDate, setEditDate] = useState('')
  const buildVehicleFromOption = (option, vehicleCount) => ({
    id: `${option.label.toLowerCase()}-${Date.now()}-${vehicleCount}`,
    optionLabel: option.label,
    selectedColor: option.colors[0].hex,
    vehicleName: `${option.model} ${vehicleCount + 1}`,
    customParts: [],
    partExpirations: {},
    removedParts: []
  })

  const [vehicles, setVehicles] = useState(() => [buildVehicleFromOption(options[0], 0)])
  const [activeVehicleId, setActiveVehicleId] = useState(vehicles[0]?.id)

  const currentVehicle = vehicles.find((vehicle) => vehicle.id === activeVehicleId) || vehicles[0]
  const currentOption = options[0]

  const updateCurrentVehicle = (updater) => {
    if (!currentVehicle) return
    setVehicles((prev) =>
      prev.map((vehicle) => (vehicle.id === currentVehicle.id ? updater(vehicle) : vehicle))
    )
  }

  const getUserStorageKey = (user) => {
    if (!user) return null
    return `${STORAGE_DATA_PREFIX}${user.sub || user.email || 'default'}`
  }

  const parseGoogleCredential = (credential) => {
    if (!credential) return null
    const parts = credential.split('.')
    if (parts.length < 2) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')
    try {
      return JSON.parse(atob(padded))
    } catch (error) {
      console.error('Unable to parse Google credential.', error)
      return null
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    if (storedUser) {
      setGoogleUser(JSON.parse(storedUser))
    }
  }, [STORAGE_USER_KEY])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_OAUTH_CLIENT_ID') {
      return
    }

    const existingScript = document.querySelector('script[data-google-signin]')
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleSignin = 'true'
    script.onload = () => {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          const profile = parseGoogleCredential(response.credential)
          if (profile) {
            const user = {
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
              sub: profile.sub
            }
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
            setGoogleUser(user)
            setHasLoadedStoredData(false)
          }
        }
      })
      const buttonElement = document.getElementById('google-signin-button')
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with'
        })
      }
    }
    document.body.appendChild(script)
  }, [GOOGLE_CLIENT_ID, STORAGE_USER_KEY])

  useEffect(() => {
    if (!googleUser || hasLoadedStoredData) {
      return
    }

    const storageKey = getUserStorageKey(googleUser)
    if (!storageKey) return
    const storedData = localStorage.getItem(storageKey)
    if (storedData) {
      const parsed = JSON.parse(storedData)
      if (parsed.vehicles?.length) {
        setVehicles(parsed.vehicles)
        setActiveVehicleId(parsed.activeVehicleId || parsed.vehicles[0]?.id)
      }
    } else {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ vehicles, activeVehicleId })
      )
    }
    setHasLoadedStoredData(true)
  }, [
    googleUser,
    hasLoadedStoredData,
    options,
    vehicles,
    activeVehicleId
  ])

  useEffect(() => {
    if (!googleUser) return
    const storageKey = getUserStorageKey(googleUser)
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify({ vehicles, activeVehicleId }))
  }, [
    googleUser,
    vehicles,
    activeVehicleId
  ])

  const handleAddVehicle = () => {
    setVehicles((prev) => {
      const newVehicle = buildVehicleFromOption(options[0], prev.length)
      setActiveVehicleId(newVehicle.id)
      return [...prev, newVehicle]
    })
    setPartName('')
    setPartExpiryDate('')
    setEditingPart(null)
  }

  const handleRemoveVehicle = (id) => {
    setVehicles((prev) => {
      if (prev.length <= 1) {
        return prev
      }
      const filtered = prev.filter((vehicle) => vehicle.id !== id)
      if (activeVehicleId === id) {
        setActiveVehicleId(filtered[0]?.id)
      }
      return filtered
    })
    setPartName('')
    setPartExpiryDate('')
    setEditingPart(null)
  }

  const handleAddPart = () => {
    if (!partName.trim() || !partExpiryDate) {
      return
    }

    const expiresAt = new Date(partExpiryDate).getTime()
    if (Number.isNaN(expiresAt)) {
      return
    }

    const createdAt = Date.now()
    const durationMs = Math.max(expiresAt - createdAt, 0)
    const normalizedName = partName.trim().toLowerCase()
    const builtInMatch = options
      .flatMap((option) => option.parts || [])
      .find((part) => part.name.toLowerCase() === normalizedName)

    if (builtInMatch) {
      updateCurrentVehicle((vehicle) => ({
        ...vehicle,
        partExpirations: {
          ...vehicle.partExpirations,
          [builtInMatch.name]: {
            createdAt,
            expiresAt,
            durationMs
          }
        }
      }))
      setPartName('')
      setPartExpiryDate('')
      return
    }

    const newPart = {
      name: partName.trim(),
      interval: `Expires on ${partExpiryDate}`,
      isCustom: true,
      id: `${partName}-${partExpiryDate}-${Date.now()}`,
      createdAt,
      expiresAt,
      durationMs
    }

    updateCurrentVehicle((vehicle) => ({
      ...vehicle,
      customParts: [newPart, ...vehicle.customParts]
    }))
    setPartName('')
    setPartExpiryDate('')
  }

  const handleRemovePart = (id) => {
    updateCurrentVehicle((vehicle) => ({
      ...vehicle,
      customParts: vehicle.customParts.filter((part) => part.id !== id)
    }))
  }

  const handleRemoveBuiltInPart = (name) => {
    updateCurrentVehicle((vehicle) => ({
      ...vehicle,
      removedParts: [...vehicle.removedParts, name]
    }))
  }

  const handleResetPart = (id) => {
    updateCurrentVehicle((vehicle) => ({
      ...vehicle,
      customParts: vehicle.customParts.map((part) =>
        part.id === id
          ? {
              ...part,
              createdAt: Date.now(),
              durationMs: Math.max(part.expiresAt - Date.now(), 0)
            }
          : part
      )
    }))
  }

  const handleResetBuiltInPart = (name) => {
    updateCurrentVehicle((vehicle) => {
      const entry = vehicle.partExpirations[name]
      if (!entry) {
        return vehicle
      }
      return {
        ...vehicle,
        partExpirations: {
          ...vehicle.partExpirations,
          [name]: { ...entry, createdAt: Date.now(), durationMs: Math.max(entry.expiresAt - Date.now(), 0) }
        }
      }
    })
  }

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

  const formatDateInput = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return ''
    return date.toISOString().slice(0, 10)
  }

  const startEditingPart = (part, isCustom) => {
    setEditingPart({ type: isCustom ? 'custom' : 'built-in', key: isCustom ? part.id : part.name })
    setEditName(part.name || '')
    setEditDate(formatDateInput(part.expiresAt || currentVehicle?.partExpirations?.[part.name]?.expiresAt))
  }

  const cancelEditing = () => {
    setEditingPart(null)
    setEditName('')
    setEditDate('')
  }

  const saveEditedPart = () => {
    if (!editingPart || !editDate) return
    const expiresAt = new Date(editDate).getTime()
    if (Number.isNaN(expiresAt)) return
    const createdAt = Date.now()
    const durationMs = Math.max(expiresAt - createdAt, 0)

    if (editingPart.type === 'custom') {
      updateCurrentVehicle((vehicle) => ({
        ...vehicle,
        customParts: vehicle.customParts.map((part) =>
          part.id === editingPart.key
            ? {
                ...part,
                name: editName.trim() || part.name,
                interval: `Expires on ${editDate}`,
                createdAt,
                expiresAt,
                durationMs
              }
            : part
        )
      }))
    } else {
      updateCurrentVehicle((vehicle) => ({
        ...vehicle,
        partExpirations: {
          ...vehicle.partExpirations,
          [editingPart.key]: {
            createdAt,
            expiresAt,
            durationMs
          }
        }
      }))
    }

    cancelEditing()
  }

  return (
    <main className={`page ${isNightMode ? 'is-night' : ''}`}>
      <div className="background-glow background-glow--left" />
      <div className="background-glow background-glow--right" />

      <section className="hero">
        <div className="hero-actions">
          <div className="auth-panel">
            {!googleUser ? <div id="google-signin-button" className="google-signin-button" /> : null}
            {googleUser ? (
              <div className="google-signed-in" role="status">
                {googleUser.picture ? (
                  <img
                    className="google-avatar"
                    src={googleUser.picture}
                    alt={`${googleUser.name || 'Google user'} avatar`}
                  />
                ) : (
                  <span className="google-avatar google-avatar--fallback" aria-hidden>
                    G
                  </span>
                )}
                <div>
                  <span className="google-status">Signed in with Google</span>
                  <span className="google-name">{googleUser.name || googleUser.email}</span>
                </div>
              </div>
            ) : null}
            {!GOOGLE_CLIENT_ID ? (
              <span className="auth-note">
                Set <strong>VITE_GOOGLE_CLIENT_ID</strong> in your <code>.env</code> to enable Google
                Sign-In.
              </span>
            ) : null}
          </div>
          <button
            className="mode-toggle"
            type="button"
            onClick={() => setIsNightMode((prev) => !prev)}
            aria-pressed={isNightMode}
          >
            {isNightMode ? 'Day mode' : 'Night mode'}
          </button>
        </div>
        <p className="eyebrow">Maintenance dashboard</p>
        <h1>
          Track every
          <span className="highlight"> car part</span>
        </h1>
        <p className="lede">
          Log expiration dates and stay on top of replacements.
        </p>

        <div className="model-section reveal">
          <div className="model-panel">
            <div className="model-glow" />
            <div className="vehicle-switcher">
              <div className="vehicle-switcher-header">
                <span className="vehicle-label">Your vehicles</span>
                <button
                  className="vehicle-add"
                  type="button"
                  onClick={handleAddVehicle}
                >
                  Add another vehicle
                </button>
              </div>
              <div className="vehicle-list">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`vehicle-chip ${vehicle.id === currentVehicle?.id ? 'is-active' : ''}`}
                  >
                    <button
                      className="vehicle-select"
                      type="button"
                      onClick={() => {
                        setActiveVehicleId(vehicle.id)
                        setEditingPart(null)
                        setPartName('')
                        setPartExpiryDate('')
                      }}
                    >
                      {vehicle.vehicleName || vehicle.optionLabel}
                    </button>
                    <button
                      className="vehicle-remove"
                      type="button"
                      onClick={() => handleRemoveVehicle(vehicle.id)}
                      aria-label={`Remove ${vehicle.vehicleName || vehicle.optionLabel}`}
                      disabled={vehicles.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="model-meta">
              <div className="pill">Tracking · {currentOption.label}</div>
              <h2 className="model-name">{currentVehicle?.vehicleName || currentOption.model}</h2>
              <p className="model-description">{currentOption.description}</p>
            </div>

              <div className="model-visual">
                <Suspense fallback={<div className="model-fallback">Loading model...</div>}>
                  <Canvas camera={{ position: [0, 1.1, 3.2], fov: 42 }}>
                    <color attach="background" args={['#0f1115']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2.5, 3, 2]} intensity={1.2} />
                    <spotLight position={[-2, 3, -2]} angle={0.45} intensity={0.6} />
                    <VehicleModel type={currentOption.label} color={currentVehicle?.selectedColor} />
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
                <span>Label your vehicle</span>
                <input
                  type="text"
                  value={currentVehicle?.vehicleName || ''}
                  placeholder="e.g., Midnight Cruiser"
                  onChange={(event) =>
                    updateCurrentVehicle((vehicle) => ({
                      ...vehicle,
                      vehicleName: event.target.value
                    }))
                  }
                />
              </label>

              <div className="palette">
                <span className="palette-label">Pick a paint color</span>
                <div className="swatches">
                  {currentOption.colors.map((color) => (
                    <button
                      key={color.hex}
                      className={`swatch ${currentVehicle?.selectedColor === color.hex ? 'is-active' : ''}`}
                      type="button"
                      style={{ backgroundColor: color.hex }}
                      aria-label={`${color.name} color`}
                      onClick={() =>
                        updateCurrentVehicle((vehicle) => ({
                          ...vehicle,
                          selectedColor: color.hex
                        }))
                      }
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

                <div className="parts-card">
                  <div className="parts-header">
                    <h3>Parts list</h3>
                    <span className="badge subtle">Schedule</span>
                  </div>
                <div className="parts-grid">
                  {[...(currentVehicle?.customParts || []), ...(currentOption.parts || [])].length > 0 ? (
                    [...(currentVehicle?.customParts || []), ...(currentOption.parts || [])]
                      .filter((part) => !(currentVehicle?.removedParts || []).includes(part.name))
                      .map((part) => {
                      const expiration = part.isCustom
                        ? part
                        : currentVehicle?.partExpirations?.[part.name]
                      const isEditing =
                        editingPart?.type === (part.isCustom ? 'custom' : 'built-in') &&
                        editingPart?.key === (part.isCustom ? part.id : part.name)
                      // eslint-disable-next-line react-hooks/purity
                      const remainingMs = expiration ? expiration.durationMs - (Date.now() - expiration.createdAt) : null
                      const remainingDays =
                        expiration && remainingMs > 0 ? Math.ceil(remainingMs / (24 * 60 * 60 * 1000)) : 0
                      const isDue = expiration ? remainingMs <= 0 : false
                      const statusLabel = expiration
                        ? isDue
                          ? 'Replace now'
                          : `${remainingDays} day${remainingDays === 1 ? '' : 's'} left`
                        : null
                      const expiryLabel = expiration ? `Expires on ${formatDate(expiration.expiresAt)}` : 'No expiry set'

                      return (
                        <div key={part.id || part.name} className="part-chip" role="button" tabIndex={0}>
                          <div className="part-chip-row">
                            <div className="part-name">{part.name}</div>
                            <div className="part-actions">
                              <button
                                className="part-edit"
                                type="button"
                                onClick={() => startEditingPart(part, part.isCustom)}
                                aria-label={`Edit ${part.name}`}
                              >
                                ✏️
                              </button>
                              <button
                                className="part-reset"
                                type="button"
                                onClick={
                                  part.isCustom
                                  ? () => handleResetPart(part.id)
                                  : () => handleResetBuiltInPart(part.name)
                              }
                              aria-label={`Reset ${part.name} timer`}
                              disabled={!expiration}
                            >
                              🔁
                            </button>
                            <button
                              className="part-remove"
                              type="button"
                              onClick={
                                part.isCustom
                                  ? () => handleRemovePart(part.id)
                                  : () => handleRemoveBuiltInPart(part.name)
                              }
                              aria-label={`Remove ${part.name}`}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {isEditing ? (
                          <div className="part-edit-fields">
                            <label className="part-edit-field">
                              <span>Name</span>
                              <input
                                className="part-edit-input"
                                type="text"
                                value={editName}
                                onChange={(event) => setEditName(event.target.value)}
                                disabled={!part.isCustom}
                              />
                            </label>
                            <label className="part-edit-field">
                              <span>Expiration date</span>
                              <input
                                className="part-edit-input"
                                type="date"
                                value={editDate}
                                onChange={(event) => setEditDate(event.target.value)}
                              />
                            </label>
                            <div className="part-edit-actions">
                              <button
                                className="part-edit-save"
                                type="button"
                                onClick={saveEditedPart}
                                disabled={!editDate}
                              >
                                Save
                              </button>
                              <button className="part-edit-cancel" type="button" onClick={cancelEditing}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}
                        <div className="part-interval">
                          {part.interval || 'Mileage coming soon'}
                          {part.isCustom ? <span className="part-tag">Custom log</span> : null}
                        </div>
                        <div className="part-expiry">{expiryLabel}</div>
                        {expiration ? (
                          <div className={`part-progress-label ${isDue ? 'is-due' : ''}`}>
                            {statusLabel}
                          </div>
                        ) : null}
                      </div>
                      )
                    })
                  ) : (
                    <div className="part-chip">
                      <div className="part-name">Parts list coming soon</div>
                    </div>
                  )}
                </div>

                <div className="parts-card maintenance-card">
                  <div className="parts-header">
                    <h3>Add a part</h3>
                    <span className="badge subtle">Tracker</span>
                  </div>
                  <p className="card-note">Log expiration dates to keep reminders accurate.</p>
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
                      <span>Expiration date</span>
                      <input
                        type="date"
                        value={partExpiryDate}
                        onChange={(e) => setPartExpiryDate(e.target.value)}
                      />
                    </label>
                    <div className="tracker-actions">
                      <span className="tracker-label">Add to tracker</span>
                      <button
                        className="tracker-button"
                        type="button"
                        onClick={handleAddPart}
                        disabled={!partName.trim() || !partExpiryDate}
                      >
                        Add part
                      </button>
                    </div>
                  </div>
                  <div className="tracker-summary">
                    <span className="tracker-dot" aria-hidden />
                    {partName && partExpiryDate ? (
                      <span>
                        Tracking {partName} · Expires {partExpiryDate}
                      </span>
                    ) : (
                      <span>Enter a part and expiration date to start tracking.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="footnote">
              <span className="dot" aria-hidden />
              Review parts for your {currentOption.label.toLowerCase()} or add another vehicle above.
              .
            </div>
          </div>
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

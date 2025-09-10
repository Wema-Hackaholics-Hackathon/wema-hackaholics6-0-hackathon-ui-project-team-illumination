import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Location = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState('loading')
  const [mapUrl, setMapUrl] = useState('')
  const [error, setError] = useState(null)
  const [viewType, setViewType] = useState('satellite')
  const [zoomLevel, setZoomLevel] = useState(18)
  const [isConfirming, setIsConfirming] = useState(false)

  const { coordinates, addressData, searchResults } = location.state || {}

  useEffect(() => {
    if (coordinates) {
      initializeMap()
    }
  }, [coordinates, viewType, zoomLevel])

  const initializeMap = () => {
    try {
      const coordsMatch = coordinates.match(/([\d.]+)°\s*([NS]),\s*([\d.]+)°\s*([EW])/)
      if (!coordsMatch) {
        throw new Error('Invalid coordinates format')
      }
      
      const lat = parseFloat(coordsMatch[1]) * (coordsMatch[2] === 'S' ? -1 : 1)
      const lng = parseFloat(coordsMatch[3]) * (coordsMatch[4] === 'W' ? -1 : 1)
      
      const baseUrl = 'https://www.google.com/maps/embed/v1/place'
      const params = new URLSearchParams({
        key: 'AIzaSyA9R52voePBmxtRan306C6xwGgpNg9BRyo',
        q: `${lat},${lng}`,
        zoom: zoomLevel.toString(),
        maptype: viewType
      })

      const fullUrl = `${baseUrl}?${params.toString()}`
      setMapUrl(fullUrl)
      setStep('mapview')

    } catch (error) {
      setError(error.message)
    }
  }

  const handleConfirmLocation = async () => {
    try {
      setIsConfirming(true)
      
      const coordsMatch = coordinates.match(/([\d.]+)°\s*([NS]),\s*([\d.]+)°\s*([EW])/)
      const lat = parseFloat(coordsMatch[1]) * (coordsMatch[2] === 'S' ? -1 : 1)
      const lng = parseFloat(coordsMatch[3]) * (coordsMatch[4] === 'W' ? -1 : 1)
      
      const confirmData = {
        panoLat: lat,
        panoLng: lng,
        heading: 0
      }
      
      const response = await fetch('/confirm-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmData)
      })
      
      if (response.ok) {
        navigate('/next-step')
      } else {
        throw new Error('Failed to confirm location')
      }
    } catch (error) {
      setError('Failed to confirm location. Please try again.')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleViewTypeChange = (newType) => {
    setViewType(newType)
  }

  const handleZoomIn = () => {
    if (zoomLevel < 21) {
      setZoomLevel(prev => prev + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => prev - 1)
    }
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0517]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Location Map</h2>
          <p className="text-gray-400">Preparing your location verification...</p>
          <p className="text-gray-500 text-sm mt-2">Loading satellite imagery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C0517]">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Map</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null)
                setStep('loading')
                initializeMap()
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/address')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, overflow: 'hidden' }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          height: '100vh',
          pointerEvents: 'auto'
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="absolute top-6 left-6 z-10 space-y-3">
        <div className="bg-gray-900/90 backdrop-blur rounded-xl p-3 border border-gray-700/50 shadow-xl">
          <div className="flex space-x-2">
            {[
              { type: 'satellite', label: 'Satellite' },
              { type: 'roadmap', label: 'Map' }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleViewTypeChange(type)}
                className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  viewType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/90 backdrop-blur rounded-xl border border-gray-700/50 shadow-xl">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 21}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-700 transition-colors duration-200 rounded-t-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <div className="w-10 h-px bg-gray-700"></div>
          
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-700 transition-colors duration-200 rounded-b-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => navigate('/address')}
          className="bg-gray-900/90 backdrop-blur rounded-xl p-3 border border-gray-700/50 shadow-xl text-white hover:bg-gray-800 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center mb-4">
          <p className="text-white text-sm bg-black/50 backdrop-blur px-4 py-2 rounded-lg">
            Have you seen your house?
          </p>
        </div>
        <button
          onClick={handleConfirmLocation}
          disabled={isConfirming}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-3 rounded-xl shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          {isConfirming ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Confirming...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Continue</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Location
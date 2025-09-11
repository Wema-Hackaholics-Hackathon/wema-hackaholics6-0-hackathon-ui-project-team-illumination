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
  const [isVerifying, setIsVerifying] = useState(false)
  const [buttonError, setButtonError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [deviceLocation, setDeviceLocation] = useState(null)
  const [panoData, setPanoData] = useState(null)

  const { coordinates, addressData, searchResults } = location.state || {}

  useEffect(() => {
    if (coordinates) {
      initializeMap()
      if (addressData) {
        localStorage.setItem('inputAddress', JSON.stringify(addressData))
      }
      getCurrentDeviceLocation()
    }
  }, [coordinates, viewType, zoomLevel, addressData])

  const getCurrentDeviceLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        )
      })

      setDeviceLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
      
      console.log('Current device location:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
    } catch (error) {
      console.error('Error getting device location:', error)
      setError('Unable to get current location for verification')
    }
  }

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
      setButtonError(null)
      
      const coordsMatch = coordinates.match(/([\d.]+)°\s*([NS]),\s*([\d.]+)°\s*([EW])/)
      const lat = parseFloat(coordsMatch[1]) * (coordsMatch[2] === 'S' ? -1 : 1)
      const lng = parseFloat(coordsMatch[3]) * (coordsMatch[4] === 'W' ? -1 : 1)
      
      console.log('Parsed coordinates:', { lat, lng })
      console.log('Original coordinates string:', coordinates)
      
      const confirmData = {
        panoLat: lat,
        panoLng: lng,
        heading: 0
      }
      
      setPanoData(confirmData)
      
      console.log('Sending to backend:', confirmData)
      
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/confirm-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Backend response:', result)
        console.log('Image URL:', result.imageUrl)
        setCapturedImage(result.imageUrl)
      } else {
        setButtonError('Try again')
      }
    } catch (error) {
      setButtonError('Network error')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleVerifyAddress = async () => {
    try {
      setIsVerifying(true)
      setButtonError(null)
      
      const bvn = localStorage.getItem('userBvn')
      const storedAddress = localStorage.getItem('inputAddress')
      
      if (!bvn) {
        setButtonError('BVN not found. Please start over.')
        return
      }
      
      if (!storedAddress) {
        setButtonError('Address information not found. Please start over.')
        return
      }
      
      if (!deviceLocation) {
        setButtonError('Device location not available. Please enable location.')
        return
      }
      
      if (!panoData) {
        setButtonError('Location not confirmed. Please confirm location first.')
        return
      }
      
      const inputAddress = JSON.parse(storedAddress)
      
      const verificationData = {
        bvn: bvn,
        inputAddress: inputAddress,
        deviceLat: deviceLocation.lat,
        deviceLng: deviceLocation.lng,
        deviceAccuracy: deviceLocation.accuracy,
        panoLat: panoData.panoLat,
        panoLng: panoData.panoLng,
        heading: panoData.heading
      }
      
      console.log('Sending verification data:', verificationData)
      console.log('Calling endpoint: /verify-address')
      
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/verify-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData)
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Verification response:', result)
        
        if (result.status === 'approved') {
          navigate('/success', { 
            state: { 
              result: result,
              message: 'Address verification approved!' 
            }
          })
        } else if (result.status === 'pending') {
          navigate('/pending', { 
            state: { 
              result: result,
              message: 'Address verification is under review' 
            }
          })
        } else if (result.status === 'rejected') {
          navigate('/rejected', { 
            state: { 
              result: result,
              message: 'Address verification was rejected' 
            }
          })
        } else {
          setButtonError('Unknown verification result')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setButtonError(errorData.message || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setButtonError('Network error during verification')
    } finally {
      setIsVerifying(false)
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
          <button
            onClick={() => navigate('/address')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl"
          >
            Go Back
          </button>
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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
        {capturedImage ? (
          <div className="bg-white rounded-lg p-4 shadow-xl max-w-md">
            <h3 className="text-gray-800 font-medium mb-3">Location Captured</h3>
            
            {/* Check if it's the "no imagery" case */}
            {capturedImage.includes('Sorry, we have no imagery here') || capturedImage.includes('streetview') ? (
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600 text-sm text-center font-medium">Location Verified</p>
                <p className="text-gray-500 text-xs text-center mt-1">Street view not available for this area</p>
              </div>
            ) : (
              <img 
                src={capturedImage} 
                alt="Captured street view" 
                className="w-full rounded-lg mb-3"
              />
            )}
            
            <p className="text-gray-600 text-xs mb-3">
              Your location has been successfully captured for verification
            </p>
            
            {buttonError && (
              <div className="mb-3">
                <p className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                  {buttonError}
                </p>
              </div>
            )}
            
            <button
              onClick={handleVerifyAddress}
              disabled={isVerifying}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Address</span>
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <p className="text-white text-xs bg-black/60 backdrop-blur px-3 py-1 rounded-md">
                Have you seen your house?
              </p>
            </div>
            
            {buttonError && (
              <div className="mb-2">
                <p className="text-red-400 text-xs bg-red-900/60 px-2 py-1 rounded">
                  {buttonError}
                </p>
              </div>
            )}
            
            <button
              onClick={handleConfirmLocation}
              disabled={isConfirming}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Location
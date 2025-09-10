import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Location = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [status, setStatus] = useState('Loading...')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Check if Google Maps API is loaded
  const isGoogleMapsLoaded = () => {
    return window.google && window.google.maps && window.google.maps.Map
  }

  useEffect(() => {
    const init = async () => {
      try {
        setStatus('Checking Google Maps API...')
        
        // Wait for Google Maps to be ready with better checking
        let attempts = 0
        const maxAttempts = 100
        
        while (!isGoogleMapsLoaded() && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (!isGoogleMapsLoaded()) {
          setStatus('Google Maps failed to load. Please refresh the page.')
          return
        }
        
        setStatus('Google Maps API loaded successfully')
        
        // Initialize with default location first, then get user location
        await initializeMapWithDefaultLocation()
        
        // Try to get user's actual location
        await getUserLocation()
        
      } catch (error) {
        console.error('Initialization error:', error)
        setStatus(`Initialization error: ${error.message}`)
      }
    }

    init()
  }, [])

  const initializeMapWithDefaultLocation = async () => {
    try {
      setStatus('Initializing map...')
      
      // Wait for DOM element to be ready
      let domAttempts = 0
      while (!mapRef.current && domAttempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        domAttempts++
      }
      
      if (!mapRef.current) {
        throw new Error('Map container not available')
      }

      // Default location (Nigeria - Lagos)
      const defaultCoords = {
        lat: 6.5244,
        lng: 3.3792
      }

      // Create map
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultCoords,
        zoom: 10,
        mapTypeId: 'roadmap',
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      })

      setMap(mapInstance)
      setStatus('Map initialized with default location')
      setIsReady(true)

    } catch (error) {
      console.error('Map initialization error:', error)
      setStatus(`Map initialization failed: ${error.message}`)
    }
  }

  const getUserLocation = async () => {
    try {
      setStatus('Getting your location...')
      
      if (!navigator.geolocation) {
        setStatus('Geolocation not supported by this browser')
        return
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes
          }
        )
      })

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      }

      setCurrentLocation(coords)
      updateMapWithLocation(coords)
      setStatus(`Location found: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (±${Math.round(coords.accuracy)}m)`)

    } catch (error) {
      console.error('Geolocation error:', error)
      let errorMessage = 'Failed to get location: '
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location access denied by user'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage += 'Location request timed out'
          break
        default:
          errorMessage += error.message || 'Unknown error'
          break
      }
      
      setStatus(errorMessage + '. Using default location.')
    }
  }

  const updateMapWithLocation = (coords) => {
    if (!map) return

    try {
      // Update map center and zoom
      map.setCenter(coords)
      map.setZoom(16)

      // Clear existing marker
      if (marker) {
        marker.setMap(null)
      }

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: 'Your Location',
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#A350B6" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12)
        }
      })

      setMarker(newMarker)

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Inter, sans-serif;">
            <strong>Your Location</strong><br>
            <small>Lat: ${coords.lat.toFixed(6)}<br>
            Lng: ${coords.lng.toFixed(6)}</small>
          </div>
        `
      })

      newMarker.addListener('click', () => {
        infoWindow.open(map, newMarker)
      })

    } catch (error) {
      console.error('Error updating map:', error)
      setStatus('Error updating map with location')
    }
  }

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    setStatus('Getting precise location...')
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0 // Force fresh location
          }
        )
      })

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      }

      setCurrentLocation(coords)
      updateMapWithLocation(coords)
      setStatus(`Precise location updated: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)} (±${Math.round(coords.accuracy)}m)`)

    } catch (error) {
      console.error('Error getting precise location:', error)
      setStatus('Failed to get precise location. Please try again.')
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleNext = () => {
    const finalData = {
      bvn: "22289000017",
      inputAddress: location.state?.addressData || {},
      deviceLat: currentLocation?.lat,
      deviceLng: currentLocation?.lng,
      deviceAccuracy: currentLocation?.accuracy,
      panoLat: currentLocation?.lat,
      panoLng: currentLocation?.lng,
      heading: 0,
      timestamp: new Date().toISOString()
    }

    console.log('Verification Data:', finalData)

    navigate('/result', { 
      state: { 
        ...location.state, 
        verificationData: finalData,
        verificationMethod: 'gps_location'
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Poppins'] text-white mb-3">
          Verify Your Address Location
        </h1>
        <p className="text-sm text-gray-300 mb-4">
          We'll show your current location on the map for address verification.
        </p>
      </div>

      {/* Status */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <p className="text-white text-sm">Status: {status}</p>
        {!isGoogleMapsLoaded() && (
          <p className="text-yellow-400 text-xs mt-1">
            Google Maps API key: {window.location.hostname === 'localhost' ? 'Development' : 'Production'}
          </p>
        )}
      </div>

      {/* Map Container */}
      <div className="bg-gray-300 rounded-lg mb-4 relative overflow-hidden" style={{ height: '400px' }}>
        {!isReady ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">{status}</p>
            </div>
          </div>
        ) : null}
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg"
          style={{ 
            display: isReady ? 'block' : 'none',
            minHeight: '400px'
          }}
        />
      </div>

      {/* Location Info */}
      {currentLocation && (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mb-4">
          <h3 className="text-sm font-medium text-white mb-2">Location Data</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
            <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
            <p>Accuracy: ±{Math.round(currentLocation.accuracy)}m</p>
            <p>Status: {currentLocation.accuracy < 50 ? 'High Accuracy' : currentLocation.accuracy < 100 ? 'Medium Accuracy' : 'Low Accuracy'}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={getCurrentLocation}
          disabled={isGettingLocation || !isReady}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isGettingLocation ? 'Getting Location...' : 
           currentLocation ? 'Update My Location' : 'Get My Location'}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isReady}
          className="w-full bg-[#A350B6] hover:bg-[#8A42A1] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {!isReady ? 'Loading...' : 'Continue with Verification'}
        </button>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Info:</strong> The map will show your current location when available. 
          If location access is denied, you can still proceed with verification using the address information provided.
        </p>
      </div>
    </div>
  )
}

export default Location
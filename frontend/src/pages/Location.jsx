import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Location = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [iframeUrl, setIframeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { coordinates, addressData, searchResults } = location.state || {}

  useEffect(() => {
    console.log('Search results:', searchResults)
    
    if (searchResults && searchResults.iframeUrl) {
      console.log('Setting iframe URL:', searchResults.iframeUrl)
      setIframeUrl(searchResults.iframeUrl)
      setIsLoading(false)
    } else {
      console.log('No iframe URL found in search results')
      setError('No street view data available')
      setIsLoading(false)
    }

    if (searchResults) {
      console.log('Available pano data:', {
        lat: searchResults.lat,
        lng: searchResults.lng,
        panoData: searchResults.panoData,
        fullData: searchResults
      })
    }
  }, [searchResults])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          console.log('Current position:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Error getting current position:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      )
    }
  }, [])

  const extractCoordinatesFromUrl = (url) => {
    if (!url) return { lat: 0, lng: 0, heading: 0 }
    
    let lat = 0
    let lng = 0
    let heading = 0
    
    try {
      const urlObj = new URL(url)
      
      lat = parseFloat(urlObj.searchParams.get('lat')) || 
            parseFloat(urlObj.searchParams.get('latitude')) || 0
      lng = parseFloat(urlObj.searchParams.get('lng')) || 
            parseFloat(urlObj.searchParams.get('longitude')) || 0
      heading = parseFloat(urlObj.searchParams.get('heading')) || 
                parseFloat(urlObj.searchParams.get('h')) || 0
      
      const urlString = url.toString()
      
      const latRegexes = [
        /[?&]lat=([^&]+)/,
        /[?&]latitude=([^&]+)/,
        /@([0-9.-]+),([0-9.-]+)/,
        /!3d([0-9.-]+)/
      ]
      
      const lngRegexes = [
        /[?&]lng=([^&]+)/,
        /[?&]longitude=([^&]+)/,
        /@([0-9.-]+),([0-9.-]+)/,
        /!4d([0-9.-]+)/
      ]
      
      const headingRegexes = [
        /[?&]heading=([^&]+)/,
        /[?&]h=([^&]+)/,
        /!1d([0-9.-]+)/
      ]
      
      for (const regex of latRegexes) {
        const match = urlString.match(regex)
        if (match && match[1]) {
          const value = parseFloat(match[1])
          if (!isNaN(value) && value !== 0) {
            lat = value
            break
          }
        }
      }
      
      for (const regex of lngRegexes) {
        const match = urlString.match(regex)
        if (match) {
          let value
          if (regex.toString() === '/@([0-9.-]+),([0-9.-]+)/') {
            value = parseFloat(match[2])
          } else {
            value = parseFloat(match[1])
          }
          if (!isNaN(value) && value !== 0) {
            lng = value
            break
          }
        }
      }
      
      for (const regex of headingRegexes) {
        const match = urlString.match(regex)
        if (match && match[1]) {
          const value = parseFloat(match[1])
          if (!isNaN(value)) {
            heading = value
            break
          }
        }
      }
      
      if (lat === 0 && lng === 0) {
        const coordMatch = urlString.match(/!3d([0-9.-]+)!4d([0-9.-]+)/)
        if (coordMatch) {
          lat = parseFloat(coordMatch[1]) || 0
          lng = parseFloat(coordMatch[2]) || 0
        }
      }
      
    } catch (error) {
      console.error('Error parsing URL:', error)
    }
    
    return { lat, lng, heading }
  }

  const handleNext = async () => {
    try {
      setIsSubmitting(true)
      
      const savedBvnData = localStorage.getItem('bvnData')
      const savedInputAddress = localStorage.getItem('inputAddress')
      
      const bvnData = savedBvnData ? JSON.parse(savedBvnData) : null
      const inputAddressData = savedInputAddress ? JSON.parse(savedInputAddress) : null
      
      const inputAddressText = inputAddressData 
        ? `${inputAddressData.houseNumber} ${inputAddressData.street}, ${inputAddressData.city}, ${inputAddressData.state}`
        : ''
      
      const currentLat = currentPosition?.lat || 0
      const currentLng = currentPosition?.lng || 0
      const fixedHeading = 50
      
      console.log('Using current GPS coordinates:', {
        currentLat,
        currentLng,
        currentPosition,
        fixedHeading
      })
      
      const dataToSend = {
        bvn: bvnData?.bvn || bvnData?.userBvn || '',
        inputAddress: inputAddressText,
        deviceLat: currentLat,
        deviceLng: currentLng,
        deviceAccuracy: currentPosition?.accuracy || 0,
        panoLat: currentLat,
        panoLng: currentLng,
        heading: fixedHeading
      }
      
      console.log('Data being sent:', dataToSend)
      
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/verify-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('Verification response:', result)

      // Check if verification was successful
      if (result.success && result.record) {
        // Navigate to success page with the verification data
        navigate('/yes-result', { 
          state: { 
            verificationResult: result,
            ...location.state 
          } 
        })
      } else {
        // Handle failed verification - stay on current page or show error
        console.log('Verification failed or rejected:', result)
        setError(`Verification failed: ${result.record?.result || 'Unknown error'}`)
      }

    } catch (error) {
      console.error('Error submitting verification:', error)
      setError(`Verification failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0517]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Street View</h2>
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
          <h2 className="text-xl font-semibold text-white mb-2">Verification Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => setError(null)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/address')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
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
        src={iframeUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          height: '100vh'
        }}
        allow="accelerometer; gyroscope; magnetometer"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Overlay with targeting frame */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-8 pointer-events-none">
        <div className="relative w-full max-w-md aspect-[4/3]">
          <div className="w-full h-full border-4 border-purple-600 rounded-lg relative">
            <div className="absolute -top-1 -left-1 w-6 h-6">
              <div className="w-full h-1 bg-purple-600 rounded-full"></div>
              <div className="w-1 h-full bg-purple-600 rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6">
              <div className="w-full h-1 bg-purple-600 rounded-full"></div>
              <div className="w-1 h-full bg-purple-600 rounded-full ml-auto"></div>
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6">
              <div className="w-1 h-full bg-purple-600 rounded-full"></div>
              <div className="w-full h-1 bg-purple-600 rounded-full mt-auto"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6">
              <div className="w-1 h-full bg-purple-600 rounded-full ml-auto"></div>
              <div className="w-full h-1 bg-purple-600 rounded-full mt-auto"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap">
                Place entrance here
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => navigate('/address')}
          className="bg-gray-900/90 backdrop-blur rounded-xl p-3 border border-gray-700/50 shadow-xl text-white hover:bg-gray-800 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/address', { 
              state: { 
                ...location.state, 
                skipToQuestion: true,
                addressData 
              }
            })}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium border border-white/30 hover:bg-white/30 transition-all duration-200"
            disabled={isSubmitting}
          >
            Skip
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Next</span>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay when submitting */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Verifying Location</h2>
            <p className="text-gray-300">Please wait while we process your verification...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Location
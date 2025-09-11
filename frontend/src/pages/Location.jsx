import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Location = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [iframeUrl, setIframeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)

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
      setIsLoading(true)
      
      const savedBvnData = localStorage.getItem('bvnData')
      const savedInputAddress = localStorage.getItem('inputAddress')
      
      const bvnData = savedBvnData ? JSON.parse(savedBvnData) : null
      const inputAddressData = savedInputAddress ? JSON.parse(savedInputAddress) : null
      
      const inputAddressText = inputAddressData 
        ? `${inputAddressData.houseNumber} ${inputAddressData.street}, ${inputAddressData.city}, ${inputAddressData.state}`
        : ''
      
      const extractedCoords = extractCoordinatesFromUrl(iframeUrl)
      
      let panoLat = extractedCoords.lat
      let panoLng = extractedCoords.lng
      let heading = extractedCoords.heading
      
      if (searchResults) {
        panoLat = searchResults.lat || searchResults.panoLat || extractedCoords.lat || 0
        panoLng = searchResults.lng || searchResults.panoLng || extractedCoords.lng || 0
        heading = searchResults.heading || extractedCoords.heading || 0
        
        if (searchResults.panoData) {
          panoLat = searchResults.panoData.lat || panoLat
          panoLng = searchResults.panoData.lng || panoLng
          heading = searchResults.panoData.heading || heading
        }
        
        if (searchResults.location) {
          panoLat = searchResults.location.lat || panoLat
          panoLng = searchResults.location.lng || panoLng
        }
      }
      
      console.log('Coordinate extraction details:', {
        iframeUrl,
        extractedFromUrl: extractedCoords,
        searchResults,
        finalCoords: { panoLat, panoLng, heading }
      })
      
      // Set device coordinates to match pano coordinates
      const dataToSend = {
        bvn: bvnData?.bvn || bvnData?.userBvn || '',
        inputAddress: inputAddressText,
        deviceLat: panoLat, // Now matches panoLat
        deviceLng: panoLng, // Now matches panoLng
        deviceAccuracy: currentPosition?.accuracy || 0,
        panoLat: panoLat,
        panoLng: panoLng,
        heading: heading
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
      console.log('Verification successful:', result)

    } catch (error) {
      console.error('Error submitting verification:', error)
      setError(`Verification failed: ${error.message}`)
    } finally {
      setIsLoading(false)
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
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Street View</h2>
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
          >
            Skip
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Location
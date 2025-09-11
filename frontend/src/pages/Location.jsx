import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Location = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [iframeUrl, setIframeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [searchResults])

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
      {/* Street View Iframe */}
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

      {/* Back Button */}
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

      {/* Continue Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={() => navigate('/success')}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-8 py-3 rounded-lg font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default Location
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Address = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState('input')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [addressData, setAddressData] = useState({
    houseNumber: '',
    street: '',
    city: '',
    state: ''
  })

  useEffect(() => {
    if (location.state?.skipToQuestion) {
      setStep('question')
      if (location.state?.addressData) {
        setAddressData(location.state.addressData)
      }
    }
  }, [location.state])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContinue = () => {
    localStorage.setItem('inputAddress', JSON.stringify(addressData))
    console.log('Address data saved:', addressData)
    setStep('question')
  }

  const handleYesClick = () => {
    handleYes()
  }

  const handleNoClick = () => {
    setModalType('no')
    setShowModal(true)
  }

  const handleYes = async () => {
    setIsLoading(true)
    setError(null)
    
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

      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      const formattedCoords = `${Math.abs(lat).toFixed(5)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(5)}° ${lng >= 0 ? 'E' : 'W'}`
      
      const dataToSend = {
        lat: lat,
        lng: lng
      }
      
      console.log('Data to send to backend:', dataToSend)
      console.log('Formatted coordinates:', formattedCoords)
      console.log('Address data:', addressData)
      
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/search-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const searchResults = await response.json()
      
      console.log('Backend response:', searchResults)
      
      navigate('/location', { 
        state: { 
          ...location.state, 
          addressData,
          searchResults,
          coordinates: formattedCoords,
          userAtAddress: true 
        }
      })

    } catch (error) {
      console.error('Error:', error)
      if (error.code === 1) {
        setError('Location access denied. Please enable location permissions.')
      } else if (error.code === 2) {
        setError('Location unavailable. Please try again.')
      } else if (error.code === 3) {
        setError('Location request timed out. Please try again.')
      } else {
        setError(`Error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNo = () => {
    navigate('/upload', { 
      state: { 
        ...location.state, 
        addressData,
        userAtAddress: false 
      }
    })
  }

  const handleModalProceed = () => {
    setShowModal(false)
    if (modalType === 'yes') {
      handleYes()
    } else {
      handleNo()
    }
  }

  const isFormValid = addressData.houseNumber?.trim() && addressData.street?.trim() && addressData.city?.trim() && addressData.state?.trim()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0517]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Getting Your Location</h2>
          <p className="text-gray-400">Please wait while we search for your address...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  if (step === 'question') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-['Poppins'] text-white mb-6 leading-tight">
            Are you at the address you want to verify?
          </h1>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-300">
              Use the address where you currently live
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleYesClick}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            Yes
          </button>
          
          <button
            onClick={handleNoClick}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            No
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur rounded-2xl max-w-md w-full border border-gray-700/50 shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl ${modalType === 'yes' ? 'bg-green-500/20 border border-green-500/30' : 'bg-blue-500/20 border border-blue-500/30'} flex items-center justify-center`}>
                      {modalType === 'yes' ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {modalType === 'yes' ? 'Real-time Verification' : 'Document Verification'}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {modalType === 'yes' ? 'GPS-based instant verification' : 'Upload utility bill for verification'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className={`${modalType === 'yes' ? 'bg-green-500/10 border border-green-500/20' : 'bg-blue-500/10 border border-blue-500/20'} rounded-lg p-3`}>
                    <h3 className="text-white font-medium mb-1">Timeline</h3>
                    <p className={`${modalType === 'yes' ? 'text-green-300' : 'text-blue-300'} text-sm`}>
                      {modalType === 'yes' ? '⚡ Results in under 2 minutes' : '⏳ Results in 3-5 business days'}
                    </p>
                  </div>

                  {/* What Happens */}
                  <div>
                    <h3 className="text-white font-medium mb-2">What happens next:</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      {modalType === 'yes' ? (
                        <>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                            <span>GPS will capture your current location</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                            <span>Street view image will be captured</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                            <span>Automatic verification against your input</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                            <span>Instant approval/rejection decision</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            <span>Upload recent utility bill document</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            <span>OCR extracts address information</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            <span>Manual review by verification team</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            <span>Email notification with results</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-white font-medium mb-2">Requirements:</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      {modalType === 'yes' ? (
                        <>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Location permissions enabled</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Must be physically at the address</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Strong internet connection</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Recent utility bill (last 3 months)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Clear, readable document image</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                            <span>Bill must show your input address</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModalProceed}
                      className={`flex-1 ${modalType === 'yes' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 rounded-lg transition-colors`}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-white mb-3">
          Address Information
        </h1>
        <p className="text-gray-300">
          Enter the address you want to verify
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-300 mb-2">
            House Number
          </label>
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={addressData.houseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#A350B6] focus:outline-none focus:bg-gray-900 transition-colors"
            placeholder="e.g. 15 or Block A Flat 3"
            required
          />
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
            Street/Area Name
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={addressData.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#A350B6] focus:outline-none focus:bg-gray-900 transition-colors"
            placeholder="e.g. Bodija Estate, Ring Road"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
            Local Government Area (LGA)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={addressData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#A350B6] focus:outline-none focus:bg-gray-900 transition-colors"
            placeholder="e.g. Ibadan North, Surulere"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={addressData.state}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#A350B6] focus:outline-none focus:bg-gray-900 transition-colors"
            placeholder="e.g. Oyo State, Lagos State"
            required
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full bg-[#A350B6] hover:bg-[#8A42A1] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

export default Address
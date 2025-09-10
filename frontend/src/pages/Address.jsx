import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Address = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState('input')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [addressData, setAddressData] = useState({
    houseNumber: '',
    street: '',
    city: '',
    state: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContinue = () => {
    setStep('question')
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
      console.log('Address data (not sent to backend):', addressData)
      
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

  const isFormValid = addressData.houseNumber?.trim() && addressData.street?.trim() && addressData.city?.trim() && addressData.state?.trim()

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
            onClick={handleYes}
            disabled={isLoading}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Getting location and searching...
              </div>
            ) : (
              'Yes'
            )}
          </button>
          
          <button
            onClick={handleNo}
            disabled={isLoading}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            No
          </button>
        </div>
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
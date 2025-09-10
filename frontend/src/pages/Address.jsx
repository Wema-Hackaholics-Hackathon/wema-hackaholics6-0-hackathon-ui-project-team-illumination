import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Address = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState('input')
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

  const handleYes = () => {
    navigate('/location', { 
      state: { 
        ...location.state, 
        addressData,
        userAtAddress: true 
      }
    })
  }

  const handleNo = () => {
    navigate('/result', { 
      state: { 
        ...location.state, 
        addressData,
        locationMethod: 'coming_soon',
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

        <div className="space-y-4">
          <button
            onClick={handleYes}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            Yes
          </button>
          
          <button
            onClick={handleNo}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-4 rounded-lg text-lg transition-colors"
          >
            No
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing you agree to the{' '}
            <span className="text-gray-400 underline">terms</span> and{' '}
            <span className="text-gray-400 underline">privacy policy</span>
          </p>
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
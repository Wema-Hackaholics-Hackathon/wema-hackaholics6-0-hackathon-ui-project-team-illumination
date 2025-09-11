import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Verify = () => {
  const navigate = useNavigate()
  const [bvn, setBvn] = useState('')
  const [verificationStep, setVerificationStep] = useState('form')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setBvn(e.target.value)
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setVerificationStep('verifying')
    setError('')
    
    try {
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/verifykyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bvn })
      })
      
      const data = await response.json()
      
      if (response.ok && data) {
        if (data.firstName || data.lastName || data.phoneNumber || data.dateOfBirth) {
          localStorage.setItem('userBvn', bvn)
          localStorage.setItem('bvnData', JSON.stringify(data))
          navigate('/address', { state: { bvn, bvnData: data } })
        } else {
          setError('Invalid BVN. No records found for this BVN number.')
          setVerificationStep('form')
        }
      } else {
        if (response.status === 404) {
          setError('BVN not found. Please check your BVN and try again.')
        } else if (response.status === 400) {
          setError('Invalid BVN format. Please enter a valid 11-digit BVN.')
        } else if (response.status >= 500) {
          setError('Server error. Please try again later.')
        } else {
          setError(data?.message || 'Verification failed. Please check your BVN and try again.')
        }
        setVerificationStep('form')
      }
    } catch (error) {
      console.error('API Error:', error)
      setError('Network error. Please check your connection and try again.')
      setVerificationStep('form')
    }
  }

  const isFormValid = bvn.length === 11 && /^\d{11}$/.test(bvn)

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-white mb-3">
          BVN Verification
        </h1>
        <p className="text-gray-300">
          Enter your BVN to fetch your details and verify identity
        </p>
      </div>

      <div className="bg-[#A350B6]/10 border border-[#A350B6]/20 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-white mb-2">Smart Verification Process</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Fetch your details instantly from BVN database</p>
          <p>• Cross-verify identity without NIBSS delays</p>
          <p>• No manual data entry required</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300 text-sm font-medium">Verification Failed</span>
          </div>
          <p className="text-red-200 text-sm mt-2">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="bvn" className="block text-sm font-medium text-gray-300 mb-2">
            Bank Verification Number (BVN)
          </label>
          <input
            type="text"
            id="bvn"
            name="bvn"
            value={bvn}
            onChange={handleInputChange}
            maxLength="11"
            className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-gray-900 transition-colors text-center text-lg tracking-widest ${
              error 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-700 focus:border-[#A350B6]'
            }`}
            placeholder="Enter your 11-digit BVN"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter only numbers (11 digits required)
          </p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || verificationStep === 'verifying'}
          className="w-full bg-[#A350B6] hover:bg-[#8A42A1] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {verificationStep === 'verifying' ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying Identity...</span>
            </>
          ) : (
            <span>Verify Identity</span>
          )}
        </button>
      </form>

      {/* Help Section */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Having trouble? Make sure you're using your correct 11-digit BVN number
        </p>
      </div>
    </div>
  )
}

export default Verify
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Verify = () => {
  const navigate = useNavigate()
  const [bvn, setBvn] = useState('')
  const [verificationStep, setVerificationStep] = useState('form')

  const handleInputChange = (e) => {
    setBvn(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setVerificationStep('verifying')
    
    try {
      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/verifykyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bvn })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        navigate('/address', { state: { bvn, bvnData: data } })
      } else {
        setVerificationStep('form')
      }
    } catch (error) {
      console.error('API Error:', error)
      setVerificationStep('form')
    }
  }

  const isFormValid = bvn.length === 11

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
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#A350B6] focus:outline-none focus:bg-gray-900 transition-colors text-center text-lg tracking-widest"
            placeholder="Enter your 11-digit BVN"
            required
          />
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
    </div>
  )
}

export default Verify
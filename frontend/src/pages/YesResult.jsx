import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const YesResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bvnData, setBvnData] = useState(null)
  const [inputAddress, setInputAddress] = useState(null)
  const [verificationData, setVerificationData] = useState(null)

  useEffect(() => {
    if (location.state?.verificationResult) {
      setVerificationData(location.state.verificationResult)
    }

    const savedBvnData = localStorage.getItem('bvnData')
    if (savedBvnData) {
      try {
        const parsed = JSON.parse(savedBvnData)
        setBvnData(parsed)
      } catch (e) {
        console.error('Error parsing BVN data:', e)
      }
    }

    const savedInputAddress = localStorage.getItem('inputAddress')
    if (savedInputAddress) {
      try {
        const parsed = JSON.parse(savedInputAddress)
        setInputAddress(parsed)
      } catch (e) {
        console.error('Error parsing address:', e)
      }
    }
  }, [location.state])

  const handleStartNew = () => {
    localStorage.removeItem('bvnData')
    localStorage.removeItem('inputAddress')
    localStorage.removeItem('ocrResponse')
    localStorage.removeItem('userBvn')
    navigate('/verify')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const formatDistance = (distance) => {
    if (!distance) return 'N/A'
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`
    }
    return `${Math.round(distance)} m`
  }

  const formatAccuracy = (accuracy) => {
    if (!accuracy) return 'N/A'
    if (accuracy >= 1000) {
      return `±${(accuracy / 1000).toFixed(1)} km`
    }
    return `±${Math.round(accuracy)} m`
  }

  const getVerificationStatus = () => {
    if (!verificationData?.record) return { status: 'pending', message: 'Processing verification...', color: 'yellow' }

    const { distance, deviceAccuracy, result } = verificationData.record

    if (result === 'approved' || (distance <= 500 && deviceAccuracy <= 50)) {
      return {
        status: 'approved',
        message: 'Your identity and address have been successfully verified',
        color: 'green',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    } else if (result === 'rejected' || distance > 1000) {
      return {
        status: 'rejected',
        message: 'We could not verify your location',
        color: 'red',
        icon: 'M6 18L18 6M6 6l12 12'
      }
    } else {
      return {
        status: 'pending',
        message: 'Your verification is being reviewed',
        color: 'yellow',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    }
  }

  const status = getVerificationStatus()

  // For rejected and pending, show improved UI with user info
  if (status.status === 'rejected' || status.status === 'pending') {
    const isRejected = status.status === 'rejected'

    return (
      <div className="max-w-2xl mx-auto">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isRejected
              ? 'bg-red-500/20 border border-red-500/30'
              : 'bg-amber-500/20 border border-amber-500/30'
          }`}>
            {isRejected ? (
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold font-['Poppins'] text-white mb-2">
            {isRejected ? 'Verification Failed' : 'Verification Pending'}
          </h1>
          <p className="text-gray-400">
            {status.message}
          </p>
        </div>

        {/* Status Banner */}
        <div className={`rounded-lg p-4 mb-6 ${
          isRejected
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-amber-500/10 border border-amber-500/20'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isRejected ? 'bg-red-500/20' : 'bg-amber-500/20'
            }`}>
              {isRejected ? (
                <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${isRejected ? 'text-red-300' : 'text-amber-300'}`}>
                {isRejected ? 'Location Mismatch Detected' : 'Manual Review in Progress'}
              </p>
              <p className={`text-xs mt-1 ${isRejected ? 'text-red-400/70' : 'text-amber-400/70'}`}>
                {isRejected
                  ? 'Your GPS location did not match the address you provided. Please ensure you are at the correct location and try again.'
                  : 'Our team is reviewing your verification. This usually takes 1-2 business days.'}
              </p>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        {bvnData && (
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#A350B6]/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-[#A350B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Identity Information</h3>
            </div>

            <div className="flex items-start space-x-4">
              {bvnData.base64Image && (
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${bvnData.base64Image}`}
                      alt="BVN Photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm text-white font-medium">{bvnData.firstName} {bvnData.middleName} {bvnData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">BVN</p>
                  <p className="text-sm text-white font-mono">{bvnData.bvn || bvnData.number || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Card */}
        {inputAddress && (
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isRejected ? 'bg-red-500/20' : 'bg-amber-500/20'
              }`}>
                <svg className={`w-4 h-4 ${isRejected ? 'text-red-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">
                {isRejected ? 'Address Not Verified' : 'Address Under Review'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">House Number</p>
                <p className="text-sm text-white">{inputAddress.houseNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
                <p className="text-sm text-white">{inputAddress.city || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Street</p>
                <p className="text-sm text-white">{inputAddress.street || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">State</p>
                <p className="text-sm text-white">{inputAddress.state || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Details (if available) */}
        {verificationData?.record && (
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Verification Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
                <p className={`text-sm font-medium ${
                  verificationData.record.distance > 500 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {formatDistance(verificationData.record.distance)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Required: ≤ 500m</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">GPS Accuracy</p>
                <p className={`text-sm font-medium ${
                  verificationData.record.deviceAccuracy > 50 ? 'text-amber-400' : 'text-green-400'
                }`}>
                  {formatAccuracy(verificationData.record.deviceAccuracy)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Required: ≤ ±50m</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStartNew}
            className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isRejected ? 'Try Again' : 'Start New Verification'}
          </button>
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-700"
          >
            Back to Home
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by IllumiTrust • Secure KYC Verification
        </p>
      </div>
    )
  }

  // For approved, show full details
  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-500/20 border border-green-500/30">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-['Poppins'] text-white mb-2">
          Verification Successful
        </h1>
        <p className="text-gray-400">
          Your identity and address have been verified
        </p>
      </div>

      {/* Status Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm font-medium text-green-300">Address Verified via GPS</span>
        </div>
      </div>

      {/* Verification Details */}
      {verificationData?.record && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Verification Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <p className="text-sm text-green-400 font-medium capitalize">{verificationData.record.result || 'Approved'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
              <p className="text-sm text-green-400 font-medium">{formatDistance(verificationData.record.distance)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">GPS Accuracy</p>
              <p className="text-sm text-white">{formatAccuracy(verificationData.record.deviceAccuracy)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Verification ID</p>
              <p className="text-sm text-white font-mono truncate">{verificationData.record.id?.slice(0, 12)}...</p>
            </div>
          </div>
        </div>
      )}

      {/* User Information Card */}
      {bvnData && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-[#A350B6]/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#A350B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Identity Information</h3>
          </div>

          <div className="flex items-start space-x-4">
            {bvnData.base64Image && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden relative">
                  <img
                    src={`data:image/jpeg;base64,${bvnData.base64Image}`}
                    alt="BVN Photo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                <p className="text-sm text-white font-medium">{bvnData.firstName} {bvnData.middleName} {bvnData.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">BVN</p>
                <p className="text-sm text-white font-mono">{bvnData.bvn || bvnData.number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                <p className="text-sm text-white">{bvnData.dateOfBirth || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm text-white font-mono">{bvnData.phoneNumber1 || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Card */}
      {inputAddress && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Verified Address</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">House Number</p>
              <p className="text-sm text-white">{inputAddress.houseNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
              <p className="text-sm text-white">{inputAddress.city || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Street</p>
              <p className="text-sm text-white">{inputAddress.street || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">State</p>
              <p className="text-sm text-white">{inputAddress.state || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleStartNew}
        className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Start New Verification
      </button>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-6">
        Powered by IllumiTrust • Secure KYC Verification
      </p>
    </div>
  )
}

export default YesResult

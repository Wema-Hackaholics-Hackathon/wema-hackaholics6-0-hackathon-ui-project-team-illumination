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
    
    const savedBvnData = sessionStorage.getItem('bvnData')
    if (savedBvnData) {
      const parsed = JSON.parse(savedBvnData)
      setBvnData(parsed)
    }

    const savedInputAddress = sessionStorage.getItem('inputAddress')
    if (savedInputAddress) {
      const parsed = JSON.parse(savedInputAddress)
      setInputAddress(parsed)
    }
  }, [location.state])

  const handleStartNew = () => {
    sessionStorage.removeItem('bvnData')
    sessionStorage.removeItem('inputAddress')
    sessionStorage.removeItem('ocrResponse')
    window.location.href = '/'
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
        message: 'Verification failed. Your location does not match the provided address',
        color: 'red',
        icon: 'M6 18L18 6M6 6l12 12'
      }
    } else {
      return {
        status: 'pending',
        message: 'Verification is under review. Please wait for manual approval',
        color: 'yellow',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    }
  }

  const status = getVerificationStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${
        status.color === 'green' 
          ? 'from-green-800/80 to-green-900/80 border-green-700/50' 
          : status.color === 'red'
          ? 'from-red-800/80 to-red-900/80 border-red-700/50'
          : 'from-yellow-800/80 to-yellow-900/80 border-yellow-700/50'
      } backdrop-blur-sm border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${
              status.color === 'green' 
                ? 'bg-green-500/20 border-green-500/30' 
                : status.color === 'red'
                ? 'bg-red-500/20 border-red-500/30'
                : 'bg-yellow-500/20 border-yellow-500/30'
            } backdrop-blur-sm rounded-full mb-4 border`}>
              <svg className={`w-8 h-8 sm:w-10 sm:h-10 ${
                status.color === 'green' 
                  ? 'text-green-400' 
                  : status.color === 'red'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
              </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {status.status === 'approved' ? 'Verification Successful!' : 
               status.status === 'rejected' ? 'Verification Failed' : 
               'Verification Pending'}
            </h1>
            <p className={`text-sm sm:text-base ${
              status.color === 'green' 
                ? 'text-green-200' 
                : status.color === 'red'
                ? 'text-red-200'
                : 'text-yellow-200'
            }`}>
              {status.message}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status Alert */}
        <div className={`bg-gradient-to-r ${
          status.color === 'green' 
            ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' 
            : status.color === 'red'
            ? 'from-red-500/10 to-red-600/10 border-red-500/30'
            : 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30'
        } border rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm`}>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${
              status.color === 'green' 
                ? 'bg-green-500/20' 
                : status.color === 'red'
                ? 'bg-red-500/20'
                : 'bg-yellow-500/20'
            } rounded-lg flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${
                status.color === 'green' 
                  ? 'text-green-400' 
                  : status.color === 'red'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-semibold ${
                status.color === 'green' 
                  ? 'text-green-300' 
                  : status.color === 'red'
                  ? 'text-red-300'
                  : 'text-yellow-300'
              } mb-1 sm:mb-2`}>
                {status.status === 'approved' ? 'Verification Complete' : 
                 status.status === 'rejected' ? 'Verification Failed' : 
                 'Under Review'}
              </h3>
              <p className={`text-sm sm:text-base ${
                status.color === 'green' 
                  ? 'text-green-200' 
                  : status.color === 'red'
                  ? 'text-red-200'
                  : 'text-yellow-200'
              } leading-relaxed`}>
                {status.status === 'approved' 
                  ? 'Your location matches the provided address. All verification steps have been completed successfully.'
                  : status.status === 'rejected'
                  ? 'Your current location is too far from the provided address. Please ensure you are at the correct location and try again.'
                  : 'Your verification is being reviewed manually. You will be notified once the review is complete.'
                }
              </p>
              
              {status.status === 'rejected' && verificationData?.record && (
                <div className="mt-3 text-sm text-red-300">
                  <p>• Distance from address: {formatDistance(verificationData.record.distance)}</p>
                  <p>• GPS accuracy: {formatAccuracy(verificationData.record.deviceAccuracy)}</p>
                  <p className="mt-1 text-red-400 font-medium">
                    Required: Within 500m with GPS accuracy ±50m
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Details */}
        {verificationData && (
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Verification Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className={`${
                status.color === 'green' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : status.color === 'red'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              } border rounded-lg p-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 ${
                    status.color === 'green' 
                      ? 'bg-green-500/20' 
                      : status.color === 'red'
                      ? 'bg-red-500/20'
                      : 'bg-yellow-500/20'
                  } rounded-full flex items-center justify-center`}>
                    <svg className={`w-3 h-3 ${
                      status.color === 'green' 
                        ? 'text-green-400' 
                        : status.color === 'red'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
                    </svg>
                  </div>
                  <label className={`text-xs font-medium ${
                    status.color === 'green' 
                      ? 'text-green-400' 
                      : status.color === 'red'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  } uppercase tracking-wider`}>Status</label>
                </div>
                <p className={`text-lg font-semibold ${
                  status.color === 'green' 
                    ? 'text-green-300' 
                    : status.color === 'red'
                    ? 'text-red-300'
                    : 'text-yellow-300'
                } capitalize`}>
                  {verificationData.record?.result || status.status}
                </p>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Distance</label>
                <p className={`text-sm sm:text-base font-medium ${
                  verificationData.record?.distance <= 500 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {formatDistance(verificationData.record?.distance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Required: ≤ 500m</p>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">GPS Accuracy</label>
                <p className={`text-sm sm:text-base font-medium ${
                  verificationData.record?.deviceAccuracy <= 50 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {formatAccuracy(verificationData.record?.deviceAccuracy)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Required: ±50m</p>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Your Location</label>
                <p className="text-sm text-white font-mono">
                  {verificationData.record?.deviceLat?.toFixed(6)}, {verificationData.record?.deviceLng?.toFixed(6)}
                </p>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Address Location</label>
                <p className="text-sm text-white font-mono">
                  {verificationData.record?.addressLat?.toFixed(6)}, {verificationData.record?.addressLng?.toFixed(6)}
                </p>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Verification ID</label>
                <p className="text-xs text-white font-mono break-all">
                  {verificationData.record?.id}
                </p>
              </div>
            </div>

            {verificationData.record?.imageUrl && (
              <div className="mt-6">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 block">Street View Capture</label>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <img 
                    src={verificationData.record.imageUrl}
                    alt="Street View Verification"
                    className="w-full max-w-2xl mx-auto rounded-lg border border-gray-600/50"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = '<div class="text-center py-8"><p class="text-gray-400">Street view image not available</p></div>'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* BVN and Address Information */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* BVN Information */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">BVN Information</h3>
              </div>
              
              {bvnData ? (
                <div className="space-y-4 sm:space-y-6">
                  {bvnData.base64Image && (
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl bg-gray-700/50 border-2 border-gray-600/50 overflow-hidden">
                          <img 
                            src={`data:image/jpeg;base64,${bvnData.base64Image}`}
                            alt="BVN Photo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gray-700 flex items-center justify-center"><svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                            }}
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 ${
                          status.color === 'green' 
                            ? 'bg-green-500' 
                            : status.color === 'red'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        } rounded-full border-2 border-gray-800 flex items-center justify-center`}>
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={status.icon} />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 break-words">{bvnData.firstName} {bvnData.middleName} {bvnData.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">BVN Number</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 font-mono break-all">{bvnData.bvn || bvnData.number || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date of Birth</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1">{bvnData.dateOfBirth || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 font-mono break-all">{bvnData.phoneNumber1 || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">No BVN data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${
                  status.color === 'green' 
                    ? 'bg-green-500/20' 
                    : status.color === 'red'
                    ? 'bg-red-500/20'
                    : 'bg-yellow-500/20'
                } rounded-lg flex items-center justify-center`}>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    status.color === 'green' 
                      ? 'text-green-400' 
                      : status.color === 'red'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {status.status === 'approved' ? 'Verified Address' : 'Provided Address'}
                </h3>
              </div>
              
              {inputAddress ? (
                <div className={`${
                  status.color === 'green' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-gray-700/30 border-gray-600/30'
                } border rounded-lg p-3 sm:p-4`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={`text-xs font-medium ${
                        status.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      } uppercase tracking-wider`}>House Number</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 break-words">{inputAddress.houseNumber || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className={`text-xs font-medium ${
                        status.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      } uppercase tracking-wider`}>City</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 break-words">{inputAddress.city || 'N/A'}</p>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className={`text-xs font-medium ${
                        status.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      } uppercase tracking-wider`}>Street</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 break-words">{inputAddress.street || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className={`text-xs font-medium ${
                        status.color === 'green' ? 'text-green-400' : 'text-gray-400'
                      } uppercase tracking-wider`}>State</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1 break-words">{inputAddress.state || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">No address data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center mt-8 sm:mt-12 pb-6 sm:pb-8">
          <button
            onClick={handleStartNew}
            className={`bg-gradient-to-r ${
              status.color === 'green' 
                ? 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                : status.color === 'red'
                ? 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
            } text-white font-medium py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base`}
          >
            {status.status === 'approved' ? 'Start New Verification' : 'Try Again'}
          </button>
          
          <div className="mt-6 sm:mt-8 px-4">
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
              status.color === 'green' 
                ? 'text-gray-300' 
                : status.color === 'red'
                ? 'text-red-200'
                : 'text-yellow-200'
            }`}>
              {status.status === 'approved' ? (
                <>
                  🎉 Congratulations! Your identity and address verification is complete.
                  <br className="hidden sm:block" />
                  You can now proceed with your account setup or other services.
                </>
              ) : status.status === 'rejected' ? (
                <>
                  ❌ Verification failed. Please ensure you are at the correct address location and try again.
                  <br className="hidden sm:block" />
                  Make sure your GPS is enabled and you have a strong signal.
                </>
              ) : (
                <>
                  ⏳ Your verification is being reviewed. You will receive an update once the review is complete.
                  <br className="hidden sm:block" />
                  This usually takes 1-2 business days.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YesResult
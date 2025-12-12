import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Result = () => {
  const navigate = useNavigate()
  const [bvnData, setBvnData] = useState(null)
  const [inputAddress, setInputAddress] = useState(null)
  const [ocrData, setOcrData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user came via document upload (has OCR data) or GPS verification
  const isDocumentVerification = ocrData !== null

  useEffect(() => {
    // Simulate brief loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

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
        console.error('Error parsing input address:', e)
      }
    }

    const savedOcrData = localStorage.getItem('ocrResponse')
    if (savedOcrData) {
      try {
        const parsed = JSON.parse(savedOcrData)
        setOcrData(parsed)
      } catch (e) {
        console.error('Error parsing OCR data:', e)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const extractImportantInfo = (ocrResponse) => {
    if (!ocrResponse?.text?.[0]) return {}

    const text = ocrResponse.text[0]

    return {
      name: text.match(/Name:\s*([A-Z\s]+)/i)?.[1]?.trim() ||
            text.match(/NAME:\s*([A-Z\s]+)/i)?.[1]?.trim() || 'Not found',

      address: text.match(/S\/Address:\s*([^\n\r]+)/i)?.[1]?.trim() ||
               text.match(/S\/ADDRESS:\s*([^\n\r]+)/i)?.[1]?.trim() ||
               text.match(/NO\.\s*\d+[^\\n\\r]*/i)?.[0]?.trim() || 'Not found',

      accountNumber: text.match(/AccountNo[:\s]*([0-9\/\-]+)/i)?.[1]?.trim() ||
                     text.match(/ACCOUNTNO[:\s]*([0-9\/\-]+)/i)?.[1]?.trim() ||
                     'Not found',

      provider: text.match(/Provider[:\s]*([A-Z\s]+)/i)?.[1]?.trim() ||
                text.match(/DISCO[:\s]*([A-Z\s]+)/i)?.[1]?.trim() ||
                'Not found',

      billDate: text.match(/Date[:\s]*([A-Z0-9\s]+)/i)?.[1]?.trim() ||
                text.match(/BILL\s*DATE[:\s]*([A-Z0-9\s]+)/i)?.[1]?.trim() ||
                'Not found',

      mobile: text.match(/MOBILE[:\s]*([0-9]+)/i)?.[1]?.trim() ||
              text.match(/Mobile[:\s]*([0-9]+)/i)?.[1]?.trim() ||
              'Not found',

      totalDue: text.match(/Total\s*Due[:\s=N=]*([0-9,\.]+)/i)?.[1]?.trim() ||
                text.match(/Amount[:\s=N=]*([0-9,\.]+)/i)?.[1]?.trim() ||
                'Not found'
    }
  }

  const billInfo = ocrData ? extractImportantInfo(ocrData) : {}

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

  // Loading state with smooth spinner
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#A350B6] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-400 mt-4 text-sm">Loading verification results...</p>
        </div>
      </div>
    )
  }

  // No data state - improved empty state
  if (!bvnData && !inputAddress && !ocrData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-6 border border-gray-700">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Verification Data</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            It looks like you haven't completed a verification yet. Start a new verification to see your results here.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={handleStartNew}
              className="w-full bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Verification
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-700"
            >
              Back to Home
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Powered by IllumiTrust • Secure KYC Verification
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDocumentVerification
            ? 'bg-amber-500/20 border border-amber-500/30'
            : 'bg-green-500/20 border border-green-500/30'
        }`}>
          {isDocumentVerification ? (
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-bold font-['Poppins'] text-white mb-2">
          {isDocumentVerification ? 'Verification Submitted' : 'Verification Complete'}
        </h1>
        <p className="text-gray-400">
          {isDocumentVerification
            ? 'Your documents are pending manual review'
            : 'Your address has been verified successfully'}
        </p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 mb-6 ${
        isDocumentVerification
          ? 'bg-amber-500/10 border border-amber-500/20'
          : 'bg-green-500/10 border border-green-500/20'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${isDocumentVerification ? 'bg-amber-400' : 'bg-green-400'}`}></div>
          <span className={`text-sm font-medium ${isDocumentVerification ? 'text-amber-300' : 'text-green-300'}`}>
            {isDocumentVerification ? 'Manual Review Required (3-5 business days)' : 'Address Verified via GPS'}
          </span>
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
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
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

      {/* Bill Information Card (only for document verification) */}
      {ocrData && (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Submitted Document</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Name on Bill</p>
              <p className="text-sm text-white">{billInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Account No.</p>
              <p className="text-sm text-white font-mono">{billInfo.accountNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Provider</p>
              <p className="text-sm text-white">{billInfo.provider}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Bill Date</p>
              <p className="text-sm text-white">{billInfo.billDate}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Address on Bill</p>
              <p className="text-sm text-white">{billInfo.address}</p>
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
          Start New Verification
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

export default Result

import React, { useState, useEffect } from 'react'

const Result = () => {
  const [bvnData, setBvnData] = useState(null)
  const [inputAddress, setInputAddress] = useState(null)
  const [ocrData, setOcrData] = useState(null)

  useEffect(() => {
    console.log('Loading data from localStorage...')
    
    const savedBvnData = localStorage.getItem('bvnData')
    if (savedBvnData) {
      const parsed = JSON.parse(savedBvnData)
      setBvnData(parsed)
      console.log('BVN Data loaded:', parsed)
    } else {
      console.log('No BVN data found')
    }

    const savedInputAddress = localStorage.getItem('inputAddress')
    if (savedInputAddress) {
      const parsed = JSON.parse(savedInputAddress)
      setInputAddress(parsed)
      console.log('Input Address loaded:', parsed)
    } else {
      console.log('No inputAddress found')
    }

    const savedOcrData = localStorage.getItem('ocrResponse')
    if (savedOcrData) {
      const parsed = JSON.parse(savedOcrData)
      setOcrData(parsed)
      console.log('OCR Data loaded:', parsed)
    } else {
      console.log('No OCR data found')
    }
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
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full mb-4 border border-green-500/30">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Complete</h1>
            <p className="text-gray-300">Your identity verification has been successfully processed</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Manual Review Required</h3>
              <p className="text-amber-200 leading-relaxed">
                Your documents have been received and will be manually reviewed by our team within 3-5 business days. 
                We will contact you once the verification is complete.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">BVN Information</h3>
              </div>
              
              {bvnData ? (
                <div className="space-y-6">
                  {bvnData.base64Image && (
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-xl bg-gray-700/50 border-2 border-gray-600/50 overflow-hidden">
                          <img 
                            src={`data:image/jpeg;base64,${bvnData.base64Image}`}
                            alt="BVN Photo"
                            className="w-full h-full object-cover"
                            onLoad={() => console.log('Image loaded successfully')}
                            onError={(e) => {
                              console.log('Image failed to load:', e);
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gray-700 flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                      <p className="text-white font-medium mt-1">{bvnData.firstName} {bvnData.middleName} {bvnData.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">BVN Number</label>
                      <p className="text-white font-medium mt-1 font-mono">{bvnData.bvn || bvnData.number || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date of Birth</label>
                      <p className="text-white font-medium mt-1">{bvnData.dateOfBirth || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</label>
                      <p className="text-white font-medium mt-1 font-mono">{bvnData.phoneNumber1 || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No BVN data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Entered Address</h3>
              </div>
              
              {inputAddress ? (
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">House Number</label>
                      <p className="text-white font-medium mt-1">{inputAddress.houseNumber || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">City</label>
                      <p className="text-white font-medium mt-1">{inputAddress.city || 'N/A'}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Street</label>
                      <p className="text-white font-medium mt-1">{inputAddress.street || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">State</label>
                      <p className="text-white font-medium mt-1">{inputAddress.state || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No address data available</p>
                </div>
              )}
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Bill Information</h3>
              </div>
              
              {ocrData ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Name on Bill</label>
                        <p className="text-white font-medium mt-1">{billInfo.name}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Account Number</label>
                        <p className="text-white font-medium mt-1 font-mono">{billInfo.accountNumber}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Service Provider</label>
                        <p className="text-white font-medium mt-1">{billInfo.provider}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bill Date</label>
                        <p className="text-white font-medium mt-1">{billInfo.billDate}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile Number</label>
                        <p className="text-white font-medium mt-1 font-mono">{billInfo.mobile}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Due</label>
                        <p className="text-white font-medium mt-1">₦{billInfo.totalDue}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Address on Bill</label>
                    <div className="bg-gray-700/30 rounded-lg p-4 mt-2">
                      <p className="text-white font-medium leading-relaxed break-words whitespace-pre-wrap">
                        {billInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No document data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pb-8">
          <button
            onClick={handleStartNew}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start New Verification
          </button>
          
          <div className="mt-8">
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Your information is securely stored and will be reviewed by our team.
              <br />
              We'll contact you within 3-5 business days with the verification results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
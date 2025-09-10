import React from 'react'

const LocationPermissionModal = ({ onPermissionResponse }) => {
  return (
    <div className="fixed inset-0 bg-[#0C0517]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#A350B6]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#A350B6]/15 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#A350B6]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#A350B6]/20 via-transparent to-[#A350B6]/20 blur-sm"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#A350B6] to-[#8B42A3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A350B6]/25">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 font-['Poppins']">
              Welcome to <span className="text-[#A350B6]">IllumiTrust</span>
            </h1>
            
            <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4 font-['Poppins']">
              Location Access Required
            </h2>
            
            <p className="text-[#A5A5A5] leading-relaxed font-['Inter'] text-sm">
              To provide you with the most accurate and personalized experience, 
              IllumiTrust needs access to your location. Your privacy and data 
              security are our top priorities.
            </p>
          </div>

          <button
            onClick={() => onPermissionResponse(true)}
            className="w-full bg-gradient-to-r from-[#A350B6] to-[#8B42A3] hover:from-[#8B42A3] hover:to-[#7A3B93] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A350B6]/30 font-['Poppins'] text-lg"
          >
            Allow Location Access
          </button>

          <p className="text-xs text-[#A5A5A5] mt-6 font-['Inter']">
            🔒 Your location is encrypted and never shared with third parties
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationPermissionModal
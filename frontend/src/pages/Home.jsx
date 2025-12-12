import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10 pt-6">
        {/* Animated Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#A350B6] to-[#7B2D8E] rounded-2xl mb-6 shadow-lg shadow-purple-500/20 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-['Poppins'] text-white mb-4 leading-tight">
          Instant Customer
          <span className="text-[#A350B6]"> Verification</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-md mx-auto">
          Skip the field visits. Verify addresses in seconds using BVN + GPS location technology.
        </p>

        <button
          onClick={() => navigate('/verify')}
          className="bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 w-full max-w-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Verification
        </button>
      </div>

      {/* How It Works */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center">
            <div className="w-10 h-10 bg-[#A350B6]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-[#A350B6] font-bold">1</span>
            </div>
            <p className="text-xs text-gray-400">Enter BVN</p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center">
            <div className="w-10 h-10 bg-[#A350B6]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-[#A350B6] font-bold">2</span>
            </div>
            <p className="text-xs text-gray-400">Confirm Address</p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center">
            <div className="w-10 h-10 bg-[#A350B6]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-[#A350B6] font-bold">3</span>
            </div>
            <p className="text-xs text-gray-400">GPS Verify</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">Lightning Fast</h3>
              <p className="text-sm text-gray-400">Complete verification in under 5 minutes. No waiting for field agents or NIBSS responses.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">GPS Precision</h3>
              <p className="text-sm text-gray-400">Customers prove their address by being physically present. No more fake addresses.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">Bank-Grade Security</h3>
              <p className="text-sm text-gray-400">BVN verification ensures identity matches. All data encrypted and secure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gradient-to-br from-[#A350B6]/20 to-transparent p-4 rounded-xl border border-[#A350B6]/20 text-center">
          <div className="text-2xl font-bold text-white mb-1">5min</div>
          <div className="text-xs text-gray-400">Avg. Time</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-transparent p-4 rounded-xl border border-green-500/20 text-center">
          <div className="text-2xl font-bold text-white mb-1">Zero</div>
          <div className="text-xs text-gray-400">Field Visits</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-transparent p-4 rounded-xl border border-blue-500/20 text-center">
          <div className="text-2xl font-bold text-white mb-1">99%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500">
        Powered by IllumiTrust • Secure KYC Verification
      </p>
    </div>
  )
}

export default Home

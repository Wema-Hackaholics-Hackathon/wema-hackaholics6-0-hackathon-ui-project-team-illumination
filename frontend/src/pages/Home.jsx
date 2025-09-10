import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-bold font-['Poppins'] text-white mb-4">
          Instant Customer Verification
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Skip the field visits. Verify addresses in seconds using BVN + GPS location
        </p>
        
        <button
          onClick={() => navigate('/verify')}
          className="bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors w-full max-w-sm"
        >
          Start Verification
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-3 font-['Poppins']">Digital Trust Score</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#A350B6] rounded-full"></span>
              <span>BVN identity verification without NIBSS delays</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#A350B6] rounded-full"></span>
              <span>GPS location proves physical address instantly</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#A350B6] rounded-full"></span>
              <span>Customer becomes active participant in verification</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-3 font-['Poppins']">Eliminate Manual Processes</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            No more field agents, no waiting for NIBSS responses, no manual address checks. 
            Get verification confidence scores in under 30 seconds using digital footprints.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4">
        <div className="bg-gray-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#A350B6] mb-1">3-5min</div>
          <div className="text-xs text-gray-400">Verification time</div>
        </div>
        <div className="bg-gray-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#A350B6] mb-1">Zero</div>
          <div className="text-xs text-gray-400">Field visits needed</div>
        </div>
      </div>
    </div>
  )
}

export default Home
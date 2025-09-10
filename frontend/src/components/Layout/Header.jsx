import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getProgress = () => {
    switch (location.pathname) {
      case '/': return { step: 0, total: 3, label: 'Welcome' }
      case '/verify': return { step: 1, total: 3, label: 'BVN Verification' }
      case '/address': return { step: 2, total: 3, label: 'Address Check' }
      case '/result': return { step: 3, total: 3, label: 'Complete' }
      default: return { step: 0, total: 3, label: 'Welcome' }
    }
  }

  const progress = getProgress()
  const progressPercentage = (progress.step / progress.total) * 100

  return (
    <header className="bg-[#0C0517] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#A350B6] to-[#8A42A1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-['Poppins']">IT</span>
            </div>
            <h1 className="text-xl font-bold font-['Poppins'] text-white">
              Illumi<span className="text-[#A350B6]">Trust</span>
            </h1>
          </div>

          {location.pathname !== '/' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-400 hover:text-[#A350B6] transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {location.pathname !== '/' && location.pathname !== '/result' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Step {progress.step} of {progress.total}</span>
              <span className="text-white font-medium">{progress.label}</span>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#A350B6] to-[#8A42A1] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {location.pathname === '/result' && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-5 h-5 bg-[#A350B6] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-medium">Verification Complete</span>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
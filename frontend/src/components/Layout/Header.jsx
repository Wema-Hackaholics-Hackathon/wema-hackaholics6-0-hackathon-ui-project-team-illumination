import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <header className="bg-[#0C0517] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
      </div>
    </header>
  )
}

export default Header
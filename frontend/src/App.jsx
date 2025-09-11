import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Layout/Header'
import Home from './pages/Home'
import Verify from './pages/Verify'
import Address from './pages/Address'
import Location from './pages/Location'
import Result from './pages/Result'
import Upload from './pages/Upload'
import LocationPermissionModal from './components/LocationPermissionModal'

const ProtectedRoute = ({ children, locationPermission, path }) => {
  const location = useLocation()
  const currentPath = location.pathname

  if (currentPath === '/') {
    return children
  }

  if (locationPermission !== 'granted') {
    return <Navigate to="/" replace />
  }

  const hasAddressData = location.state?.addressData || false
  const userAtAddress = location.state?.userAtAddress

  switch (currentPath) {
    case '/verify':
      return children

    case '/address':
      return children

    case '/upload':
      if (!hasAddressData) {
        console.log('❌ Upload page accessed without address data - redirecting to /address')
        return <Navigate to="/address" replace />
      }
      return children

    case '/location':
      if (!hasAddressData) {
        console.log('❌ Location page accessed without address data - redirecting to /address')
        return <Navigate to="/address" replace />
      }
      return children

    case '/result':
      return children

    default:
      return children
  }
}

const FlowStatus = ({ locationPermission }) => {
  const location = useLocation()
  const hasAddressData = location.state?.addressData || false
  const userAtAddress = location.state?.userAtAddress

  if (locationPermission !== 'granted') return null

  const steps = [
    { name: 'Location Permission', completed: locationPermission === 'granted', current: false },
    { name: 'Address Input', completed: hasAddressData, current: location.pathname === '/address' },
    {
      name: userAtAddress === false ? 'Document Upload' : 'Location Verification',
      completed: false,
      current: location.pathname === '/upload' || location.pathname === '/location'
    },
    { name: 'Result', completed: false, current: location.pathname === '/result' }
  ]

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Verification Progress</h3>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center">
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' :
                step.current ? 'bg-[#A350B6]' : 'bg-gray-600'
              }`}>
              {step.completed && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`ml-2 text-xs ${step.completed ? 'text-green-400' :
                step.current ? 'text-[#A350B6]' : 'text-gray-500'
              }`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-600 ml-2"></div>
            )}
          </div>
        ))}
      </div>

      {hasAddressData && (
        <div className="mt-3 text-xs text-gray-400">
          Address: {location.state?.addressData?.houseNumber} {location.state?.addressData?.street}
          {userAtAddress === true && <span className="text-green-400 ml-2">• User at address</span>}
          {userAtAddress === false && <span className="text-orange-400 ml-2">• User not at address</span>}
        </div>
      )}
    </div>
  )
}

const ConditionalLayout = ({ children, locationPermission }) => {
  const location = useLocation()
  const isLocationPage = location.pathname === '/location'

  if (isLocationPage) {
    return children
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {locationPermission === 'denied' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm font-medium">Location Access Required</span>
                </div>
                <p className="text-red-300 text-xs">
                  Enable location access to use verification features
                </p>
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                className="bg-[#A350B6] hover:bg-[#8A42A1] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Grant Permission
              </button>
            </div>
          </div>
        )}
        {children}
      </main>
    </>
  )
}

const App = () => {
  const [locationPermission, setLocationPermission] = useState(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isCheckingPermission, setIsCheckingPermission] = useState(true)

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        setIsCheckingPermission(true)

        if ('geolocation' in navigator && 'permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'geolocation' })

          console.log('📍 Location permission state:', permission.state)

          if (permission.state === 'granted') {
            setLocationPermission('granted')
            console.log('✅ Location permission already granted')
          } else if (permission.state === 'denied') {
            setLocationPermission('denied')
            setShowLocationModal(true)
            console.log('❌ Location permission denied')
          } else {
            console.log('⏳ Location permission prompt needed')
            setShowLocationModal(true)
          }
        } else {
          setLocationPermission('unsupported')
          console.log('❌ Geolocation not supported')
        }
      } catch (error) {
        console.error('Error checking location permission:', error)
        setShowLocationModal(true)
      } finally {
        setIsCheckingPermission(false)
      }
    }

    checkLocationPermission()
  }, [])

  const handleLocationPermission = async (granted) => {
    if (granted) {
      try {
        console.log('🔄 Requesting location access...')

        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission('granted')
              setShowLocationModal(false)
              console.log('✅ Location accessed successfully:', {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
              })
              resolve(position)
            },
            (error) => {
              console.error('❌ Location access failed:', error)
              setLocationPermission('denied')
              setShowLocationModal(false)

              alert('Location access is required for IllumiTrust verification features. Please enable location access in your browser settings and refresh the page.')
              reject(error)
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000
            }
          )
        })
      } catch (error) {
        console.error('Location permission error:', error)
        setLocationPermission('denied')
      }
    } else {
      console.log('❌ User denied location permission')
      setLocationPermission('denied')
      setShowLocationModal(false)
    }
  }

  const retryLocationPermission = () => {
    setShowLocationModal(true)
  }

  if (isCheckingPermission) {
    return (
      <div className="min-h-screen bg-[#0C0517] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A350B6] mx-auto mb-4"></div>
          <p className="text-gray-400">Checking location permissions...</p>
        </div>
      </div>
    )
  }

  if (showLocationModal) {
    return <LocationPermissionModal onPermissionResponse={handleLocationPermission} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0517] text-gray-200">
        <ConditionalLayout locationPermission={locationPermission}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/verify">
                  <Verify />
                </ProtectedRoute>
              }
            />
            <Route
              path="/address"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/address">
                  <Address />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/upload">
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/location"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/location">
                  <Location />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute locationPermission={locationPermission} path="/result">
                  <Result />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ConditionalLayout>
      </div>
    </BrowserRouter>
  )
}

export default App
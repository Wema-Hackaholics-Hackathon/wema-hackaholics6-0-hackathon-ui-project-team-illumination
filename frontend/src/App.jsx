import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Home from './pages/Home'
import Verify from './pages/Verify'
import Address from './pages/Address'
import Location from './pages/Location'
import Result from './pages/Result'
import LocationPermissionModal from './components/LocationPermissionModal'

const App = () => {
  const [locationPermission, setLocationPermission] = useState(null)
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        if ('geolocation' in navigator && 'permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'geolocation' })
          
          if (permission.state === 'granted') {
            setLocationPermission('granted')
          } else if (permission.state === 'denied') {
            setLocationPermission('denied')
            setShowLocationModal(true)
          } else {
            setShowLocationModal(true)
          }
        } else {
          setLocationPermission('unsupported')
        }
      } catch (error) {
        console.error('Error checking location permission:', error)
        setShowLocationModal(true)
      }
    }

    checkLocationPermission()
  }, [])

  const handleLocationPermission = async (granted) => {
    if (granted) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission('granted')
              setShowLocationModal(false)
              console.log('Location accessed:', position.coords)
              resolve(position)
            },
            (error) => {
              console.error('Location access failed:', error)
              alert('Location access is required for IllumiTrust to function properly. Please enable location access in your browser settings.')
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
      }
    }
  }

  if (showLocationModal) {
    return <LocationPermissionModal onPermissionResponse={handleLocationPermission} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0517] text-gray-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/address" element={<Address />} />
            <Route path="/location" element={<Location />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
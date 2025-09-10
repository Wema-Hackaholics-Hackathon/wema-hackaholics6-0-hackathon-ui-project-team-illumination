import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Home from './pages/Home'
import Verify from './pages/Verify'
import Address from './pages/Address'
import Location from './pages/Location'
import Result from './pages/Result'

const App = () => {
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
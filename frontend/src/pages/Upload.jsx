import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Upload = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [uploadStep, setUploadStep] = useState('upload')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (validTypes.includes(file.type)) {
        setSelectedFile(file)
        setError(null)
      } else {
        setError('Please upload a valid file (JPG, PNG, or PDF)')
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('utilityBill', selectedFile)

      console.log('Uploading file:', selectedFile.name)
      console.log('File size:', selectedFile.size)
      console.log('File type:', selectedFile.type)

      const response = await fetch('https://wema-hackaholics6-0-hackathon-ui-project-ncjw.onrender.com/upload-utility-bill', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('Upload response:', data)

      setUploadStep('success')
      setIsUploading(false)

    } catch (error) {
      console.error('Upload error:', error)
      setError(`Upload failed: ${error.message}`)
      setIsUploading(false)
    }
  }

  const handleTryAgain = () => {
    navigate('/address', { 
      state: { 
        ...location.state
      }
    })
  }

  if (uploadStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Upload Complete</h1>
                <p className="text-gray-400">Document received successfully</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Processing Your Request</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We'll review your document and get back to you within 3-5 business days with your verification results.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-xl transition-all duration-200 shadow-lg"
              >
                Try Location Verification Instead
              </button>
              
              <p className="text-gray-500 text-sm">
                Go to your address for instant verification
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Document Upload</h1>
          <p className="text-gray-400">Upload your recent utility bill</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-800/30 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-white font-medium mb-3">Accepted Documents</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Electricity bill</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Water bill</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Gas bill</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Internet bill</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Must be within the last 3 months</p>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            
            <label
              htmlFor="file-upload"
              className={`block w-full border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center transition-all duration-200 ${
                isUploading 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:border-purple-500 hover:bg-purple-500/5'
              }`}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Drop your file here or click to browse</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, or PDF up to 10MB</p>
                </div>
              </div>
            </label>

            {selectedFile && (
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-all duration-200 shadow-lg"
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
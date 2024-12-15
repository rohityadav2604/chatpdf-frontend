'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { usePDFContext } from '../context/PDFContext'
import { Progress } from "@/components/ui/progress"
import { Loader2 } from 'lucide-react'

export default function PDFUpload() {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { addPDF } = usePDFContext()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          setError('File size exceeds 5MB limit')
          return
        }

        setIsLoading(true)
        setUploadProgress(0)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('id', Date.now().toString()) // Keep the id as before

        try {
          const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData,
          })

          // Simulate progress
          const simulateProgress = () => {
            setUploadProgress((prevProgress) => {
              if (prevProgress < 90) {
                return prevProgress + 10
              }
              return prevProgress
            })
          }

          const progressInterval = setInterval(simulateProgress, 200)

          const data = await response.json()

          clearInterval(progressInterval)
          setUploadProgress(100)

          if (response.status === 400) {
            throw new Error(data.message || 'Bad Request')
          }

          if (response.status !== 200) {
            throw new Error(`Upload failed with status ${response.status}`)
          }

          addPDF({
            id: data.id,
            name: data.name,
            size: data.size,
          })

        } catch (error) {
          console.error('Error:', error)
          setError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setIsLoading(false)
          setTimeout(() => setUploadProgress(0), 1000) // Reset progress after 1 second
        }
      })
    },
    [addPDF],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <div className="mb-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ease-in-out ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
        ) : (
          <FiUpload className="mx-auto text-4xl mb-4 text-blue-500" />
        )}
        {isDragActive ? (
          <p className="text-blue-500 dark:text-blue-400">Drop the PDF here ...</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {isLoading ? 'Uploading...' : "Drag 'n' drop a PDF here, or click to select one"}
          </p>
        )}
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Maximum file size: 5MB</p>
      </div>
      {uploadProgress > 0 && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : 'Upload Complete!'}
          </p>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  )
}


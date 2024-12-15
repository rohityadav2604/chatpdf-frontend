'use client'

import { useState } from 'react'
import { usePDFContext } from '../context/PDFContext'
import { FiSend } from 'react-icons/fi'

export default function ChatInterface() {
  const { selectedPDF, messages, addMessage } = usePDFContext()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || !selectedPDF) return

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
    }

    addMessage(selectedPDF, userMessage)
    setInput('')
    setIsLoading(true)

    try {

      const response = await fetch('https://storybook-m780.onrender.com/retrieve', { // Replace with your actual RAG API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input, pdfId: selectedPDF }), // Include selectedPDF ID in request
      })

      if (!response.ok) {
        throw new Error('RAG request failed')
      }

      const data = await response.json()
      const aiMessage = {
        id: data.id,
        text: data.message,
        sender: 'ai' as const,
      }

      addMessage(selectedPDF, aiMessage)
    } catch (error) {
      console.error('Error:', error)
      addMessage(selectedPDF, {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, an error occurred. Please try again.',
        sender: 'ai' as const,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedPDF ? (
          (messages[selectedPDF] || []).map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a PDF to start chatting
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>
      {selectedPDF && (
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend()
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


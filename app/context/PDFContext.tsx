'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

interface PDF {
  id: string
  name: string
  size: number
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
}

interface PDFContextType {
  pdfs: PDF[]
  addPDF: (pdf: PDF) => void
  removePDF: (id: string) => void
  selectedPDF: string | null
  setSelectedPDF: (id: string | null) => void
  messages: Record<string, Message[]>
  addMessage: (pdfId: string, message: Message) => void
}

const PDFContext = createContext<PDFContextType | undefined>(undefined)

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfs, setPDFs] = useState<PDF[]>([])
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})

  const addPDF = (pdf: PDF) => {
    setPDFs((prevPDFs) => [...prevPDFs, pdf])
    setMessages((prevMessages) => ({ ...prevMessages, [pdf.id]: [] }))
  }

  const removePDF = (id: string) => {
    setPDFs((prevPDFs) => prevPDFs.filter((pdf) => pdf.id !== id))
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages }
      delete newMessages[id]
      return newMessages
    })
    if (selectedPDF === id) {
      setSelectedPDF(null)
    }
  }

  const addMessage = (pdfId: string, message: Message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [pdfId]: [...(prevMessages[pdfId] || []), message],
    }))
  }

  return (
    <PDFContext.Provider
      value={{
        pdfs,
        addPDF,
        removePDF,
        selectedPDF,
        setSelectedPDF,
        messages,
        addMessage,
      }}
    >
      {children}
    </PDFContext.Provider>
  )
}

export const usePDFContext = () => {
  const context = useContext(PDFContext)
  if (context === undefined) {
    throw new Error('usePDFContext must be used within a PDFProvider')
  }
  return context
}


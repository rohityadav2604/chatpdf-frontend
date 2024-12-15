'use client'

import { usePDFContext } from '../context/PDFContext'
import { FiFile, FiTrash2 } from 'react-icons/fi'

export default function PDFList() {
  const { pdfs, selectedPDF, setSelectedPDF, removePDF } = usePDFContext()

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your PDFs</h2>
      {pdfs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center my-auto">No PDFs uploaded yet</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto flex-grow">
          {pdfs.map((pdf) => (
            <li
              key={pdf.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ease-in-out ${
                selectedPDF === pdf.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              } cursor-pointer`}
              onClick={() => setSelectedPDF(pdf.id)}
            >
              <div className="flex items-center space-x-3 truncate">
                <FiFile className="flex-shrink-0" />
                <span className="truncate">{pdf.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePDF(pdf.id)
                }}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Delete PDF"
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


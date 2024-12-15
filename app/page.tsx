import PDFUpload from './components/PDFUpload'
import PDFList from './components/PDFList'
import ChatInterface from './components/ChatInterface'

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row h-screen p-4 md:p-6 gap-6">
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">ChatWithPDF</h1>
          <PDFUpload />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex-grow overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
          <PDFList />
        </div>
      </div>
      <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl">
        <ChatInterface />
      </div>
    </main>
  )
}


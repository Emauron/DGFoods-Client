import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import api from './services/api/api'
import { useEffect } from 'react'
function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    api.get('/api/products').then((response) => {
      console.log(response.data)
    })
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
          <img src={reactLogo} className="h-24 w-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      <h1 className="text-6xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Vite + React
      </h1>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full mb-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          count is {count}
        </button>
        <p className="text-white/90 text-center">
          Edit <code className="bg-gray-800 px-2 py-1 rounded text-sm">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-white/70 text-center mt-8 max-w-md">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

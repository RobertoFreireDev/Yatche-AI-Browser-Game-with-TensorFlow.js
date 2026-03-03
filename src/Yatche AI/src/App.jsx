import { useEffect } from 'react'
import './App.css'
import TrainingTablePage from './pages/TrainingTablePage'
import tensorflowService from './services/tensorflowService'

function App() {
  useEffect(() => {
    tensorflowService.initialize().catch((error) => {
      console.error('Failed to initialize TensorFlow model from local storage:', error)
    })
  }, [])

  return (
    <TrainingTablePage></TrainingTablePage>
  )
}

export default App

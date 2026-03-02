import { useEffect, useState } from 'react'
import tensorflowService from '../services/tensorflowService'

function InferenceTablePage() {
  const [prediction, setPrediction] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function runDemo() {
    setStatus('running')
    setError('')

    try {
      const value = await tensorflowService.runSimpleDemo()
      setPrediction(value)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'TensorFlow test failed.')
    }
  }

  useEffect(() => {
    runDemo()
  }, [])

  return (
    <section className="empty-route-page" aria-label="Inference table page">
      <h2>TensorFlow.js Singleton Test</h2>
      <p>Runs a simple linear model with x=[1,2,3,4], y=[1,3,5,7].</p>
      <button type="button" onClick={runDemo} disabled={status === 'running'}>
        {status === 'running' ? 'Running...' : 'Run Test Again'}
      </button>
      {status === 'success' && (
        <p role="status">Prediction for x=5: {prediction?.toFixed(3)}</p>
      )}
      {status === 'error' && <p role="alert">Error: {error}</p>}
    </section>
  )
}

export default InferenceTablePage

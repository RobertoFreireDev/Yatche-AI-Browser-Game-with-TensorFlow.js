import { useEffect, useState } from 'react'
import './App.css'
import InferenceTablePage from './pages/InferenceTablePage'
import TrainingTablePage from './pages/TrainingTablePage'

const DEFAULT_ROUTE = '/training-table'

const ROUTES = {
  '/training-table': {
    label: 'Training Table',
    element: <TrainingTablePage />,
  },
  '/inference-table': {
    label: 'Inference Table',
    element: <InferenceTablePage />,
  },
}

function isValidRoute(pathname) {
  return pathname in ROUTES
}

function App() {
  const startingPath = isValidRoute(window.location.pathname)
    ? window.location.pathname
    : DEFAULT_ROUTE
  const [currentPath, setCurrentPath] = useState(startingPath)

  useEffect(() => {
    if (!isValidRoute(window.location.pathname)) {
      window.history.replaceState({}, '', DEFAULT_ROUTE)
    }

    function handlePopState() {
      const nextPath = isValidRoute(window.location.pathname)
        ? window.location.pathname
        : DEFAULT_ROUTE
      setCurrentPath(nextPath)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath) {
    if (nextPath === currentPath) return

    window.history.pushState({}, '', nextPath)
    setCurrentPath(nextPath)
  }

  return (
    <main>
      <nav className="route-nav" aria-label="Model sections">
        {Object.entries(ROUTES).map(([path, route]) => (
          <button
            key={path}
            type="button"
            className={`route-link ${currentPath === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            {route.label}
          </button>
        ))}
      </nav>
      {ROUTES[currentPath].element}
    </main>
  )
}

export default App

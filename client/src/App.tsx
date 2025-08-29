import { BrowserRouter } from 'react-router-dom'
import Router from './app/router'
import { Providers } from './app/providers'

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Providers>
  )
}


import { Auth0Provider } from '@auth0/auth0-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID

if (!auth0Domain || !auth0ClientId) {
  throw new Error('Auth0 domain and client ID must be configured.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin,
        scope: import.meta.env.VITE_AUTH0_SCOPE,
      }}
      clientId={auth0ClientId}
      domain={auth0Domain}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
)

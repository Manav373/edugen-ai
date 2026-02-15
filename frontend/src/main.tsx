import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we have a valid Clerk key (not the placeholder)
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_your_key_here'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {hasValidClerkKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY!} signInForceRedirectUrl="/chat" signUpForceRedirectUrl="/chat">
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)



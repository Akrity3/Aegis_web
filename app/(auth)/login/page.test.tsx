import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from './page'

// Mock the child component
vi.mock('@/app/(auth)/_components/LoginForm', () => ({
  default: ({ showGoogleButton }: { showGoogleButton: boolean }) => (
    <div data-testid="login-form" data-has-google={showGoogleButton}>
      Mock Login Form
    </div>
  ),
}))

// Mock Google Provider
vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children, clientId }: any) => (
    <div data-testid="google-provider" data-client-id={clientId}>
      {children}
    </div>
  ),
}))

describe('LoginPage', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  it('renders LoginForm without Google button when clientId is missing', () => {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = ''
    
    const { getByTestId, queryByTestId } = render(<LoginPage />)
    
    expect(queryByTestId('google-provider')).not.toBeInTheDocument()
    const form = getByTestId('login-form')
    expect(form).toBeInTheDocument()
    expect(form.getAttribute('data-has-google')).toBe('false')
  })

  it('renders LoginForm with Google button when valid clientId is provided', () => {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com'
    
    const { getByTestId } = render(<LoginPage />)
    
    const provider = getByTestId('google-provider')
    expect(provider).toBeInTheDocument()
    expect(provider.getAttribute('data-client-id')).toBe('test-client-id.apps.googleusercontent.com')
    
    const form = getByTestId('login-form')
    expect(form).toBeInTheDocument()
    expect(form.getAttribute('data-has-google')).toBe('true')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from '../src/app/page'

// Mock next/link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, 'aria-label': ariaLabel, className }: any) => (
      <a href={href} aria-label={ariaLabel} className={className}>
        {children}
      </a>
    ),
  }
})

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<LandingPage />)
    const heading = screen.getByText(/Productivity/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the call to action buttons', () => {
    render(<LandingPage />)
    const cta = screen.getAllByText(/Get Started/i)
    expect(cta.length).toBeGreaterThan(0)
  })
})

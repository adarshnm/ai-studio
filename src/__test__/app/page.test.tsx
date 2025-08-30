import Page from '@/app/page'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock the hooks to prevent localStorage and fetch errors in tests
jest.mock('@/components/studio/hooks/useHistory', () => ({
  useHistory: () => ({
    history: [],
    setHistory: jest.fn(),
  }),
}))

jest.mock('@/components/studio/hooks/useGenerate', () => ({
  useGenerate: () => ({
    generate: jest.fn(),
    abort: jest.fn(),
    canAbort: false,
    loading: false,
    error: null,
    setError: jest.fn(),
  }),
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main AI Studio heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { name: /ai studio/i })

    expect(heading).toBeInTheDocument()
  })

  it('renders essential UI components', () => {
    render(<Page />)

    // Check for Generate button
    const generateButton = screen.getByTestId('generate-button')
    expect(generateButton).toBeInTheDocument()
    expect(generateButton).not.toBeDisabled()

    // Check for Abort button
    const abortButton = screen.getByTestId('abort-button')
    expect(abortButton).toBeInTheDocument()
    expect(abortButton).toBeDisabled() // Should be disabled when not loading
  })

  it('has proper document structure with main container', () => {
    render(<Page />)

    // Check for main container with test ID
    const mainContainer = screen.getByTestId('ai-studio-main')
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer).toHaveRole('main')

    // Check for main card and history card
    const mainCard = screen.getByTestId('main-card')
    const historyCard = screen.getByTestId('history-card')
    expect(mainCard).toBeInTheDocument()
    expect(historyCard).toBeInTheDocument()
  })

  it('renders file upload section', () => {
    render(<Page />)

    // Should have file input
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', 'image/png,image/jpeg')

    // Should have upload instructions
    const uploadText = screen.getByText(/drag.*drop.*browse/i)
    expect(uploadText).toBeInTheDocument()
  })

  it('renders prompt and style selection areas', () => {
    render(<Page />)

    // Should have prompt input
    const promptInput = screen.getByLabelText(/prompt/i)
    expect(promptInput).toBeInTheDocument()
    expect(promptInput).toHaveAttribute(
      'placeholder',
      'Describe what to generate',
    )

    // Should have style selector trigger
    const styleLabel = screen.getByText('Style')
    expect(styleLabel).toBeInTheDocument()

    // Should have style selector (combobox)
    const styleSelect = screen.getByRole('combobox', { name: /style/i })
    expect(styleSelect).toBeInTheDocument()
  })

  it('displays the correct initial state', () => {
    render(<Page />)

    // Generate button should be enabled initially
    const generateButton = screen.getByTestId('generate-button')
    expect(generateButton).not.toBeDisabled()

    // Abort button should be disabled when not generating
    const abortButton = screen.getByTestId('abort-button')
    expect(abortButton).toBeDisabled()

    // Prompt input should be empty initially
    const promptInput = screen.getByLabelText(/prompt/i)
    expect(promptInput).toHaveValue('')
  })

  it('renders history section with scroll area', () => {
    render(<Page />)

    // History section should be present with proper ARIA attributes
    const historyCard = screen.getByTestId('history-card')
    expect(historyCard).toBeInTheDocument()
    expect(historyCard).toHaveAttribute('role', 'region')
    expect(historyCard).toHaveAttribute('aria-labelledby', 'history-heading')

    // History scroll area should be present
    const scrollArea = screen.getByTestId('history-scroll-area')
    expect(scrollArea).toBeInTheDocument()
  })

  it('has accessible structure with proper ARIA labels', () => {
    render(<Page />)

    // Buttons should have proper labels
    const generateButton = screen.getByTestId('generate-button')
    const abortButton = screen.getByTestId('abort-button')

    expect(generateButton).toHaveAccessibleName()
    expect(abortButton).toHaveAccessibleName()

    // Form elements should be properly labeled
    const fileInput = screen.getByLabelText(/upload image/i)
    const promptInput = screen.getByLabelText(/prompt/i)
    const styleSelect = screen.getByLabelText(/style/i)

    expect(fileInput).toBeInTheDocument()
    expect(promptInput).toBeInTheDocument()
    expect(styleSelect).toBeInTheDocument()
  })

  it('contains all required sections for functionality', () => {
    render(<Page />)

    // Upload section
    const uploadSection = screen.getByTestId('upload-section')
    expect(uploadSection).toBeInTheDocument()

    // Prompt and style inputs
    const promptInput = screen.getByLabelText(/prompt/i)
    const styleSelect = screen.getByLabelText(/style/i)
    expect(promptInput).toBeInTheDocument()
    expect(styleSelect).toBeInTheDocument()

    // Action buttons
    const generateButton = screen.getByTestId('generate-button')
    const abortButton = screen.getByTestId('abort-button')
    expect(generateButton).toBeInTheDocument()
    expect(abortButton).toBeInTheDocument()

    // History section
    const historyCard = screen.getByTestId('history-card')
    expect(historyCard).toBeInTheDocument()
  })

  it('has proper form validation attributes', () => {
    render(<Page />)

    // File input should accept only images
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toHaveAttribute('accept', 'image/png,image/jpeg')
    expect(fileInput).toHaveAttribute('type', 'file')

    // Prompt input should have descriptive placeholder
    const promptInput = screen.getByLabelText(/prompt/i)
    expect(promptInput).toHaveAttribute(
      'placeholder',
      'Describe what to generate',
    )

    // Style selector should have accessible name
    const styleSelect = screen.getByLabelText(/style/i)
    expect(styleSelect).toHaveAttribute('aria-label', 'Style')
  })
})

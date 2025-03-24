import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock axios to avoid actual API calls during tests
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { message: 'Test message from DB' } }))
}));

test('renders SyncPlayer heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/SyncPlayer/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays loading message initially', () => {
  render(<App />);
  const loadingMessage = screen.getByText(/Loading.../i);
  expect(loadingMessage).toBeInTheDocument();
});
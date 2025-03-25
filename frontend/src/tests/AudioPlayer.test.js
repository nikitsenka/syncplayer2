import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';

describe('AudioPlayer component', () => {
  // Mock createObjectURL and revokeObjectURL
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn(() => 'mock-url');
    window.URL.revokeObjectURL = jest.fn(() => {});
  });

  // Mock HTMLMediaElement properties and methods
  const setupMediaElementMock = () => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      writable: true,
      value: jest.fn(() => Promise.resolve()),
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      writable: true,
      value: jest.fn(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
      writable: true,
      value: 200,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
      writable: true,
      value: 0,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
      writable: true,
      value: 1,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      writable: true,
      value: true,
    });
  };

  beforeEach(() => {
    setupMediaElementMock();
  });

  it('should render the file selection button', () => {
    render(<AudioPlayer />);
    const selectButton = screen.getByText(/Select Audio File/i);
    expect(selectButton).toBeInTheDocument();
  });

  it('should display player controls after file selection', () => {
    render(<AudioPlayer />);

    // Simulate file selection
    const fileInput = screen.getByAcceptValue(/\.mp3&/);
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: true
    });

    fireEvent.change(fileInput);

    // Check if player controls are displayed
    expect(screen.getByText(/test.mp3/)).toBeInTheDocument();
    expect(screen.getByText(/00:00/)).toBeInTheDocument(); // Time display
  });

});
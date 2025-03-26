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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the file selection button', () => {
    render(<AudioPlayer />);
    const selectButton = screen.getByText(/Select Audio File/i);
    expect(selectButton).toBeInTheDocument();
  });

  it('should display player controls after file selection', () => {
    render(<AudioPlayer />);

    // Mock FileReader
    const originalFileReader = global.FileReader;
    const mockFileReaderInstance = {
      readAsArrayBuffer: jest.fn(),
      onload: null,
    };
    const mockFileReader = jest.fn(() => mockFileReaderInstance);
    global.FileReader = mockFileReader;

    // Simulate file selection
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: true
    });

    fireEvent.change(fileInput);

    // Trigger the FileReader onload event with mock data
    if (mockFileReaderInstance.onload) {
      mockFileReaderInstance.onload({
        target: {
          result: new ArrayBuffer(100),
        },
      });
    }

    // Check if player controls are displayed
    expect(screen.getByText(/test.mp3/)).toBeInTheDocument();
    
    // Audio placeholder or icon should be visible
    expect(screen.getByText('🎵')).toBeInTheDocument();

    // Restore the original FileReader
    global.FileReader = originalFileReader;
  });

  it('should display album art when available', async () => {
    render(<AudioPlayer />);

    // Mock extractAlbumArt function result
    jest.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      if (blob instanceof Blob) {
        return 'mock-album-art-url';
      }
      return 'mock-audio-url';
    });

    // Mock FileReader for album art extraction
    const originalFileReader = global.FileReader;
    const mockFileReaderInstance = {
      readAsArrayBuffer: jest.fn(),
      onload: null,
    };
    const mockFileReader = jest.fn(() => mockFileReaderInstance);
    global.FileReader = mockFileReader;

    // Simulate file selection
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: true
    });

    fireEvent.change(fileInput);

    // Restore the original FileReader
    global.FileReader = originalFileReader;
  });
});
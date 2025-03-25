import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../components/AudioPlayer';

describe('AudioPlayer Component', () => {
  // Mock the URL.createObjectURL function
  window.URL.createObjectURL = jest.fn().mockReturnValue('mock-file-url');

  // Mock HTML mediaElement properties that are not implemented in jsdom
  window.HTMLMediaElement.prototype.pause = jest.fn();
  window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());

  // Clear the mocks after tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders select button initially', () => {
    render(<AudioPlayer />);
    const selectPrompt = screen.getByText('Select an audio file to play');
    const selectButton = screen.getByText('Select');
    expect(selectPrompt).toBeInTheDocument();
    expect(selectButton).toBeInTheDocument();
  });

  // Helper function to simulate file selection
  const simulateFileSelection = () => {
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
    const input = document.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input);
  };

  test('shows audio player after selecting a file', async () => {
    render(<AudioPlayer />);
    simulateFileSelection();
    const audioElement = document.querySelector('audio');
    expect(audioElement).toBeInTheDocument();
    const playButton = document.querySelector('.play-pause-btn');
    expect(playButton).toBeInTheDocument();
  });
});

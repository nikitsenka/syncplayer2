import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../components/AudioPlayer';

describe('AudioPlayer Component', () => {
  test('renders select button when no audio file is loaded', () => {
    render(<AudioPlayer />);
    const selectButton = screen.getByText('Select Audio');
    expect(selectButton).toBeInTheDocument();
  });

  test('hides select button when audio file is loaded', () => {
    const { container } = render(<AudioPlayer />);
    
    // Mock file input change
    const input = container.querySelector('input[type="file"]');
    
    // Create a mock file
    const file = new File(['dummy content'], 'audio.mp3', { type: 'audio/mp3' });
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    
    // Trigger file input change
    fireEvent.change(input, { target: { files: [file] } });
    
    // Select button should no longer be visible
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument();
    
    // Clean up
    global.URL.createObjectURL.mockReset();
  });
});
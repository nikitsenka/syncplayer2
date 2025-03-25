import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

/**
 * Audio Player Component that allows users to select and play audio files
 * with basic controls like play/pause, volume, and time display.
 */
const AudioPlayer = () => {
  // State for audio file
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Handle audio file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is among the allowed audio formats
      const fileType = file.type;
      if (fileType.includes('audio/mp3') || fileType.includes('audio/wav') || fileType.includes('audio/ogg')) {
        const fileURL = URL.createObjectURL(file);
        setAudioFile({
          file, 
          url: fileURL,
          name: file.name
        });
        // Reset player state when a new file is selected
        setCurrentTime(0);
        setIsPlaying(false);
      } else {
        alert('Please select an audio file in .mp3, .wav, or .ogg format');
      }
    }
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .catch(e => {
            console.error('Error playing audio:', e);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seeking
  const handleSeek = (event) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  // Format time display (converts seconds to mm:ss format)
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return '00:00';
  };

  // Effect to autoplay when a file is selected
  useEffect(() => {
    if (audioFile && audioRef.current) {
      // Automatically play when a file is selected
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(e => {
          console.error('Error autoplaying audio:', e);
          setIsPlaying(false);
        });
    }
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioFile]);

  return (
    <div className="audio-player-container">
      {!audioFile ? (
        <div className="select-file-container">
          <p className="select-prompt">Select an audio file to play</p>
          <label className="select-button">
            Select
            <input
              type="file"
              accept=".mp3,.wav,.ogg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div className="media-player-container">
          <div className="audio-info">
            <div className="audio-image">
              {/* Music icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 23h6v-2h2v-4H2V9l4-4h12v12l-4 4z"/><circle cx="8" cy="17" r="4"/><circle cx="16" cy="17" r="4"/><path d="M12 9V2l2 2-2 2-2-2z"/></svg>
            </div>
            <div className="song-title">
              {audioFile?.name || 'Unknown' }
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={audioFile.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={() => console.error('Error loading audio file')}
          />
          
          <div className="play-controls">
            <button className="play-pause-btn" onClick={togglePlay}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 19 12 5 20 5 4"/></svg>
              )}
            </button>
          </div>
          
          <div className="time-controls">
            <div className="time-display">
              {formatTime(currentTime)}
            </div>
            
            <input
              type="range"
              className="time-slider"
              value={currentTime || 0}
              max={duration || 0}
              step="0.01"
              onChange={handleSeek}
            />
            
            <div className="time-display">
              {formatTime(duration)}
            </div>
          </div>
          
          <div className="volume-control">
            <div className="volume-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>{volume > 0 && (
                <>
                  <path d="M15.54 8C17.29 9.45 18.5 11.63 18.5 14c0 2.37-1.22 4.55-3 6"></path>
                  {volume > 0.5 && <path d="M19.22 4C23.2 7.5 25.5 11.5 25.5 14c0 2.5-2.3 6.4-6.4 10"></path>}
                </>
              )}</svg>
            </div>
            
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          
          <div className="select-new-file">
            <label className="select-button small">
              Change
              <input
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

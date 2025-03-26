import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError(null); // Reset any previous errors
    
    if (file) {
      // Check file type explicitly
      const validTypes = ['.mp3', '.waæ', '.ogg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(file.type) && !validTypes.includes(fileExtension)) {
        setError("Please select an audio file in .mp3, .wav, or .ogg format");
        // Reset the file input
        event.target.value = '';
        return;
      }
      
      const audioUrl = URL.createObjectURL(file);
      setAudioFile({
        url: audioUrl,
        name: file.name,
      });
      setIsPlaying(true); // Auto-play when file is selected
    }
  };

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Playback error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Update current time during playback
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const updateTimeDisplay = () => {
        setCurrentTime(audioElement.currentTime);
        setDuration(audioElement.duration);
      };
      
      const handlePlayStateChange = () => {
        setIsPlaying(!audioElement.paused);
      };
      
      const handleError = (e) => {
        console.error("Audio error:", e);
        setError("Error playing audio file. Please try another file.");
        setAudioFile(null);
      };
      
      // Set up event listeners
      audioElement.addEventListener('timeupdate', updateTimeDisplay);
      audioElement.addEventListener('loadedmetadata', updateTimeDisplay);
      audioElement.addEventListener('play', handlePlayStateChange);
      audioElement.addEventListener('pause', handlePlayStateChange);
      audioElement.addEventListener('error', handleError);
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      // Auto-play when a new file is loaded
      if (audioFile && isPlaying) {
        audioElement.play().catch(error => {
          console.error('Auto-play failed:', error);
          setIsPlaying(false);
        });
      }
      
      return () => {
        // Clean up event listeners
        audioElement.removeEventListener('timeupdate', updateTimeDisplay);
        audioElement.removeEventListener('loadedmetadata', updateTimeDisplay);
        audioElement.removeEventListener('play', handlePlayStateChange);
        audioElement.removeEventListener('pause', handlePlayStateChange);
        audioElement.removeEventListener('error', handleError);
        audioElement.removeEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });
      };
    }
  }, [audioFile, isPlaying]);

  return (
    <div className="audio-player">
      {!audioFile ? (
        <div className="file-selection">
          <input
            type="file"
            accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,.mp3,.wav,.ogg"
            id="audio-file"
            onChange={handleFileSelect}
          />
          <label htmlFor="audio-file" className="select-button">
            Select Audio File
          </label>
          {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </div>
      ) : (
        <div className="player-controls">
          <div className="audio-info">
            <div className="audio-thumbnail">
              <div className="audio-icon"><span role="img" aria-label="music"></span></div>
            </div>
            <div className="audio-title">
              {audioFile.name}
            </div>
          </div>
          
          <div className="playback-controls">
            <button 
              className={`play-pause-button ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? '‚ùíûùí' : '‚õñ'}
            </button>
            
            <div className="time-controls">
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="seek-slider"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                step="0.01"
              />
              <span className="total-time">{formatTime(duration)}</span>
            </div>
            
            <div className="volume-controls">
              <span className="volume-icon">{volume > 0 ? 'üêê' : 'üêÑ'}</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                value={volume}
                onChange={handleVolumeChange}
                step="0.01"
              />
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={audioFile.url}
            preload="metadata"
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
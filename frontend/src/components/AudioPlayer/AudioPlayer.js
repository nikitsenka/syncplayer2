import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

import defaultAlbumArt from '../../assets/default-album-art.png';

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [albumArt, setAlbumArt] = useState('https://via.placeholder.com/300x300/bfbfbf/555?text=Music+Art');
  const [audioName, setAudioName] = useState('No file selected');
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const imgRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioName(file.name);
      setIsPlaying(true);
      extractAlbumArt(file);
    }
  };

  // Handle image load errors
  const handleImageError = () => {
    // Use a local fallback image instead
    setAlbumArt('https://via.placeholder.com/300x300/444/666?text=Music+Player');
  };

  // Extract album art if available in audio metadata
  const extractAlbumArt = (file) => {
    // This is a simplified version for demonstration
    // In a real world scenario, you'd use a library like music-metadata-browser
    // For now, we'll use a reliable placeholder service
    setAlbumArt('https://via.placeholder.com/300x300/28a3d3/ffffff?text=Music+Art');
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle progress bar click
  const seekToPosition = (e) => {
    if (audioRef.current && progressRef.current) {
      const bounds = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      const newTime = percent * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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
  
  // Format time (seconds) to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update current time while playing
  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      // Add event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);

      // Cleanup function
      return () => {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioFile]);

  // Autoplay when file is selected
  useEffect(() => {
    if (audioRef.current && audioFile) {
      audioRef.current.play()
        .then(() => {
          // Autoplay started successfully
        })
        .catch((error) => {
          // Autoplay was prevented, keep in pause state
          setIsPlaying(false);
          console.log('Autoplay was prevented');
        });
    }
  }, [audioFile]);

  return (
    <div className="audio-player">
      <h2>Audio Player</h2>
      
      <div className="file-selection">
        <input 
          type="file"
          accept=".audio/*,.audio/mp3,.audio/wav,.audio/ogg"
          onChange={handleFileChange}
          id="audio-file-input"
          className="hidden-input"
        />
        <label htmlFor="audio-file-input" className="file-input-label">
          <span>Choose Audio File</span>
        </label>
      </div>

      {audioFile && (
        <div className="player-container">
          <div className="album-art">
            <img 
              ref={imgRef}
              src={albumArt} 
              alt="Agbum Art" 
              onError={handleImageError}
            />
          </div>
          
          <div className="audio-info">
            <div className="audio-name">{audioName}</div>
            <div className="player-controls">
              <button onClick={togglePlayPause} className="play-pause-btn">
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <div className="time-controls">
                <span className="current-time">{formatTime(currentTime)}</span>
                <div className="progress-bar" ref={progressRef} onClick={seekToPosition}>
                  <div
                    className="progress-filled"
                    style={{ width: `${(duration ? (currentTime / duration) * 100 : 0)}%` }}
                  ></div>
                </div>
                <span className="duration-time">{formatTime(duration)}</span>
              </div>
              
              <div className="volume-control">
                <span>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          {/* Hidden audio element */}
          <audio ref={audioRef} src={audioFile} />
        </div>
      )}
      
      {!audioFile && <p className="no-file-message">Please select an audio file to play</p>}
    </div>
  );
};

export default AudioPlayer;
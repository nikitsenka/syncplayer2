import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [albumArt, setAlbumArt] = useState(null);
  const audioRef = useRef(null);
  
  // A more robust approach for extracting album art
  const extractAlbumArt = async (file) => {
    try {
      // Use jsmediatags library if available (you would need to install it)
      if (window.jsmediatags) {
        return new Promise((resolve) => {
          window.jsmediatags.read(file, {
            onSuccess: function(tag) {
              try {
                const picture = tag.tags.picture;
                if (picture) {
                  const data = picture.data;
                  const format = picture.format;
                  let base64String = "";
                  
                  for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                  }
                  
                  const dataUrl = `data:${format};base64,${window.btoa(base64String)}`;
                  resolve(dataUrl);
                } else {
                  resolve(null);
                }
              } catch (error) {
                console.error("Error processing album art:", error);
                resolve(null);
              }
            },
            onError: function() {
              resolve(null);
            }
          });
        });
      }
      
      // Fallback method using web audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // For demonstration purposes, generate a placeholder image based on audio characteristics
      // In a real app, you'd need a proper tag parser library
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      // Draw gradient background based on audio characteristics
      const gradient = ctx.createLinearGradient(0, 0, 150, 150);
      gradient.addColorStop(0, `hsl(${Math.floor(audioBuffer.duration) % 360}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${(Math.floor(audioBuffer.duration * 1.5) % 360)}, 80%, 40%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 150, 150);
      
      // Draw some audio visualization bars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      const channels = audioBuffer.getChannelData(0);
      const blockSize = Math.floor(channels.length / 10);
      
      for (let i = 0; i < 10; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channels[i * blockSize + j]);
        }
        const avg = sum / blockSize;
        const height = Math.max(5, avg * 1000);
        ctx.fillRect(i * 15 + 5, 150 - height, 10, height);
      }
      
      // Add a music note icon in the center
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♪', 75, 75);
      
      // Convert to data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Error extracting album art:", error);
      return null;
    }
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      
      // Try to extract album art
      try {
        const artUrl = await extractAlbumArt(file);
        setAlbumArt(artUrl);
      } catch (error) {
        console.error("Error extracting album art:", error);
        setAlbumArt(null);
      }
      
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
        audioRef.current.play();
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
      
      // Set up event listeners
      audioElement.addEventListener('timeupdate', updateTimeDisplay);
      audioElement.addEventListener('loadedmetadata', updateTimeDisplay);
      audioElement.addEventListener('play', handlePlayStateChange);
      audioElement.addEventListener('pause', handlePlayStateChange);
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
        audioElement.removeEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });
      };
    }
  }, [audioFile, isPlaying]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioFile) {
        URL.revokeObjectURL(audioFile.url);
      }
      if (albumArt && albumArt.startsWith('blob:')) {
        URL.revokeObjectURL(albumArt);
      }
    };
  }, [audioFile, albumArt]);

  return (
    <div className="audio-player">
      {!audioFile ? (
        <div className="file-selection">
          <input
            type="file"
            accept=".mp3,.wav,.ogg"
            id="audio-file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="audio-file" className="select-button">
            Select Audio File
          </label>
        </div>
      ) : (
        <div className="player-controls">
          <div className="audio-info">
            <div className="audio-thumbnail">
              {albumArt ? (
                <img src={albumArt} alt="Album Art" className="album-art" />
              ) : (
                <div className="audio-icon">🎵</div>
              )}
            </div>
            <div className="audio-title">
              {audioFile.name.replace(/\.[^/.]+$/, "")}
            </div>
          </div>
          
          <div className="playback-controls">
            <button 
              className={`play-pause-button ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? '◘◘' : '▸'}
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
              <span className="volume-icon">{volume > 0 ? '🔊' : '🔇'}</span>
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
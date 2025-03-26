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
  
  // Extract album art from audio file
  const extractAlbumArt = (file) => {
    return new Promise((resolve) => {
      // Create a new FileReader
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const result = e.target.result;
        
        // For MP3 files (ID3 tags)
        if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
          try {
            // Look for the APIC frame which contains the album art
            const uint8Array = new Uint8Array(result);
            let offset = 0;
            
            // Search for ID3 header
            while (offset < uint8Array.length - 10) {
              // Look for 'APIC' frame
              if (uint8Array[offset] === 65 && uint8Array[offset + 1] === 80 && 
                  uint8Array[offset + 2] === 73 && uint8Array[offset + 3] === 67) {
                
                // Skip to the image data
                let imgOffset = offset + 10;
                
                // Skip text encoding (1 byte), MIME type, description, and picture type
                while (imgOffset < uint8Array.length && uint8Array[imgOffset] !== 0) imgOffset++;
                imgOffset++; // Skip null terminator
                
                // Skip MIME type
                while (imgOffset < uint8Array.length && uint8Array[imgOffset] !== 0) imgOffset++;
                imgOffset++; // Skip null terminator
                
                // Skip description
                while (imgOffset < uint8Array.length && uint8Array[imgOffset] !== 0) imgOffset++;
                imgOffset++; // Skip null terminator
                
                // Skip picture type (1 byte)
                imgOffset++;
                
                // Extract image data
                const imageBlob = new Blob([uint8Array.subarray(imgOffset)], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(imageBlob);
                resolve(imageUrl);
                return;
              }
              offset++;
            }
          } catch (error) {
            console.error('Error extracting album art:', error);
          }
        }
        
        // If we couldn't extract album art or it's not an MP3 file
        resolve(null);
      };
      
      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      
      // Try to extract album art
      const artUrl = await extractAlbumArt(file);
      setAlbumArt(artUrl);
      
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
      if (albumArt) {
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
              {audioFile.name}
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
import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';
import defaultAlbumArt from '../../assets/default-album-art.png';

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [albumArt, setAlbumArt] = useState(defaultAlbumArt);
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
    // Use local fallback image
    setAlbumArt(defaultAlbumArt);
  };

  // Extract album art from the audio file's metadata
  const extractAlbumArt = (file) => {
    // Set the default album art immediately while we extract the actual art
    setAlbumArt(defaultAlbumArt);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      // Parsing ID3 tags for MP3 files
      try {
        const bytes = new Uint8Array(arrayBuffer);
        
        // ID3 tags start with "fflag "ID3"
        if (bytes[0] === 73 && bytes[1] === 68 && bytes[2] === 51) { // "ID3" in ASCII
          // Version and flags            
          const version = bytes[3];
          const flags = bytes[4];
          
          // Tag size, unsynchronised size (four bytes where the MSB = 0)
          const tagSize = bytes[9] | (bytes[8] << 7) | (bytes[7] << 14) | (bytes[6] << 21) + 10;

          // Skip to the start of the tags (10 is the size of the ID3 header)
          let offset = 10;
          
          // Search for the APIC (picture) frame
          while (offset < tagSize) {
            // Check if this is the APIC frame
            if (
              bytes[offset] === 65 && // 'A'
              bytes[offset+1] === 80 && // 'P'
              bytes[offset+2] === 73 && // 'I'
              bytes[offset+3] === 67    // 'C'
            ) {
              // Found APIC frame, need to parse it
              // Frame size is stored at offset+4 to offset+8
              const frameSize = bytes[offset+7] | (bytes[offset+6] << 8) | (bytes[offset+5] << 16) | (bytes[offset+4] << 24);
              const frameHeaderSize = 10; // Header is 10 bytes
              
              // Now jump past the frame header and text encoding (1 byte) and mime type (variable length, null terminated)
              let imgDataOffset = offset + frameHeaderSize + 1; // Skip header and text encoding
              
              // Skip mime type (search for null terminator)
              while (bytes[imgDataOffset] !== 0) {
                imgDataOffset++;
                if (imgDataOffset - offset > frameSize) break; // Safety check
              }
              imgDataOffset++; // Skip the null terminator

              // Skip picture type (1 byte) and description (variable length, null terminated)
              imgDataOffset++; // Skip picture type
              
              // Skip description
              while (bytes[imgDataOffset] !== 0) {
                imgDataOffset++;
                if (imgDataOffset - offset > frameSize) break; // Safety check
              }
              imgDataOffset++; // Skip the null terminator

              // Now imgDataOffset should point to the image data
              // Check for JPEG or PNG headers
              let imageType = 'image/jpeg'; // Default
              if (bytes[imgDataOffset] === 137 && bytes[imgDataOffset+1] === 80) { // PNG header (139, 80 = "MP" in ASCII)
                imageType = 'image/png';
              }

              // Create a Blob from the image data and create a URL for it
              const imageData = arrayBuffer.slice(imgDataOffset);
              const blob = new Blob([imageData], { type: imageType });
              const imageUrl = URL.createObjectURL(blob);
              
              // Set the album art
              setAlbumArt(imageUrl);
              return; // We found and processed the image data, so return
            }
            
            // Not an APIC frame, move to next frame
            // Frame size is stored at offset+4 to offset+8
            const frameSize = bytes[offset+7] | (bytes[offset+6] << 8) | (bytes[offset+5] << 16) | (bytes[offset+4] << 24);
            offset += 10 + frameSize; // Skip frame header (10 bytes) and frame content
          }
        }
                
        // If we reached here, we couldn't extract the album art, so use the default
        setAlbumArt(defaultAlbumArt);
      } catch (error) {
        console.error('Error extracting album art:', error);
        setAlbumArt(defaultAlbumArt);
      }
    };
                   
    reader.onerror = () => {
      console.error('Error reading file');
      setAlbumArt(defaultAlbumArt);
    };
    
    // Read the file as an ArrayBuffer to access binary data
    reader.readAsArrayBuffer(file);
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
          accept=".mp3,.wav,.ogg,audio/*"
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
              alt="Album Art" 
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
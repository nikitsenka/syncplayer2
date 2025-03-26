import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && isAudioFile(file)) {
      setAudioFile(URL.createObjectURL(file));
    }
  };
  
  const isAudioFile = (file) => {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
    return validTypes.includes(file.type);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
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
  
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    audioRef.current.play();
    setIsPlaying(true);
  };
  
  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  
  useEffect(() => {
    return () => {
      if (audioFile) {
        URL.revokeObjectURL(audioFile);
      }
    };
  }, [audioFile]);
  
  return (
    <div className="audio-player">
      {!audioFile ? (
        <div>
          <button onClick={handleFileSelect}>Select Audio</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".mp3,.wav,.ogg"
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
          <div className="audio-image">
            <span role="img" aria-label="music">🎵</span>
          </div>
          
          <div className="audio-controls">
            <button onClick={togglePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          
          <input
            type="range"
            className="seek-bar"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          
          <div className="audio-info">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="volume-control">
            <label htmlFor="volume">Volume:</label>
            <input
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          
          <audio
            ref={audioRef}
            src={audioFile}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
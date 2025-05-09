import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  onComplete?: () => void;
  videoMetadata?: {
    provider?: string;
    quality?: string;
    duration?: number;
    thumbnail?: string;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  title, 
  onComplete,
  videoMetadata 
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [qualityOptions] = useState(['1080p', '720p', '480p', '360p']);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if the URL is a Bunny CDN iframe URL
  const isBunnyIframeUrl = url.includes('iframe.mediadelivery.net');

  useEffect(() => {
    // Only add event listeners if not using Bunny iframe
    if (!isBunnyIframeUrl) {
      const handleMouseMove = () => {
        setShowControls(true);
        
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
          if (playing) {
            setShowControls(false);
          }
        }, 3000);
      };
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          setPlaying(prev => !prev);
          e.preventDefault();
        } else if (e.code === 'ArrowRight') {
          handleForward();
          e.preventDefault();
        } else if (e.code === 'ArrowLeft') {
          handleRewind();
          e.preventDefault();
        } else if (e.code === 'KeyM') {
          setMuted(prev => !prev);
          e.preventDefault();
        } else if (e.code === 'KeyF') {
          toggleFullscreen();
          e.preventDefault();
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeyDown);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [playing, isBunnyIframeUrl]);

  // If this is a Bunny CDN iframe URL, render an iframe directly
  if (isBunnyIframeUrl) {
    return (
      <div 
        className="relative bg-black rounded-lg overflow-hidden w-full h-full"
        ref={playerContainerRef}
      >
        <iframe
          src={url}
          className="absolute top-0 left-0 w-full h-full border-0"
          title={title || "Video Player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%' }}
        ></iframe>
        
        {title && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white z-10 pointer-events-none">
            <h3 className="font-medium">{title}</h3>
            {videoMetadata?.provider && (
              <span className="text-xs opacity-80">
                Source: {videoMetadata.provider}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Continue with the original ReactPlayer implementation for other video sources
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      
      // If played is > 95%, consider it complete
      if (state.played > 0.95 && onComplete) {
        onComplete();
      }
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(currentTime + 10, duration));
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;

  return (
    <div 
      className="relative group bg-black rounded-lg overflow-hidden"
      ref={playerContainerRef}
      onMouseEnter={() => setShowControls(true)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        style={{ position: 'absolute', top: 0, left: 0 }}
        config={{
          youtube: {
            playerVars: { modestbranding: 1 }
          }
        }}
      />
      
      {/* Video Title */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white z-10">
          <h3 className="font-medium">{title}</h3>
          {videoMetadata?.provider && (
            <span className="text-xs opacity-80">
              Source: {videoMetadata.provider}
            </span>
          )}
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center mb-2">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, #9ca3af ${played * 100}%, #9ca3af 100%)`
            }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            
            <button 
              onClick={handleRewind}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleForward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #9ca3af ${volume * 100}%, #9ca3af 100%)`
                }}
              />
            </div>
            
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-md shadow-lg p-2 w-24">
                  <div className="text-white text-xs font-medium mb-1 px-2">Quality</div>
                  {qualityOptions.map(quality => (
                    <button
                      key={quality}
                      onClick={() => {
                        setSelectedQuality(quality);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full text-left px-2 py-1 text-sm rounded ${
                        selectedQuality === quality 
                          ? 'bg-blue-600 text-white' 
                          : 'text-white hover:bg-gray-700'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface CCIEVideoPlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
}

export const CCIEVideoPlayer: React.FC<CCIEVideoPlayerProps> = ({ 
  videoUrl, 
  title = "CCIE Enterprise Infrastructure Overview", 
  description = "Learn about the CCIE Enterprise Infrastructure certification and how our training program can help you succeed."
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };
  
  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <div className="relative aspect-video">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          muted={isMuted}
          controls={false}
          onProgress={handleProgress}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0
              }
            }
          }}
        />
        
        {/* Custom overlay controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end">
          {/* Progress bar */}
          <div className="w-full h-1 bg-white/20">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePlayPause}
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <button 
                onClick={handleMute}
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
            
            <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Video info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}; 
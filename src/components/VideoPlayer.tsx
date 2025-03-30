import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Define the props for the VideoPlayer component
interface VideoPlayerProps {
  options: videojs.PlayerOptions;
  onReady?: (player: videojs.Player) => void;
  className?: string;
}

/**
 * VideoPlayer - A wrapper around the Video.js player
 * Provides video playback functionality for the movie editor
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  options, 
  onReady,
  className = '' 
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    // Make sure the video element is available
    if (!videoRef.current) return;

    // Initialize Video.js player if it hasn't been initialized yet
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      
      // Add CSS classes
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);
      
      // Initialize the player
      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('Player is ready');
        
        // Call the onReady prop if provided
        if (onReady) {
          onReady(player);
        }
      });
    } else {
      // If the player already exists, update its options
      const player = playerRef.current;
      
      // Update player options
      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
      
      // If poster is provided, update it
      if (options.poster) {
        player.poster(options.poster);
      }
    }
  }, [options, videoRef, onReady]);

  // Cleanup the player when the component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className={className}>
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default VideoPlayer;
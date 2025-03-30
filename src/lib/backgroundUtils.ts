/**
 * Utility functions for handling background images and fallbacks
 */

/**
 * Check if a background image exists and return a fallback if it doesn't
 * @param path The path to the background image to check
 * @param fallback The fallback background to use if the image doesn't exist
 * @returns The original path if the image exists, or the fallback if it doesn't
 */
export const getBackgroundWithFallback = async (
  path: string = '/backgrounds/default-movie-set.gif',
  fallback: string = 'linear-gradient(to bottom right, #0f172a, #1e293b)'
): Promise<string> => {
  // In client components, use this to check if the image exists
  if (typeof window !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(path);
      img.onerror = () => resolve(fallback);
      img.src = path;
    });
  }
  
  // For server components, just return the path (Next.js will handle 404s)
  return path;
};

/**
 * Get a random cinematic background color gradient as a fallback
 * @returns A CSS gradient string
 */
export const getRandomCinematicGradient = (): string => {
  const gradients = [
    'linear-gradient(to bottom right, #0f172a, #1e293b)', // Slate
    'linear-gradient(to bottom right, #1e1b4b, #312e81)', // Indigo
    'linear-gradient(to bottom right, #3f0f1f, #881337)', // Rose
    'linear-gradient(to bottom right, #0c4a6e, #0369a1)', // Sky
    'linear-gradient(to bottom right, #365314, #4d7c0f)', // Lime
    'linear-gradient(to bottom right, #4c1d95, #6d28d9)', // Purple
    'linear-gradient(to bottom right, #0f172a, #5b21b6)', // Mix
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};
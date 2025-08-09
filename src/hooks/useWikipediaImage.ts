import { useState, useEffect } from 'react';

interface WikipediaImageResponse {
  query?: {
    pages?: {
      [key: string]: {
        thumbnail?: {
          source: string;
        };
      };
    };
  };
}

export const useWikipediaImage = (celebrityName: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!celebrityName) return;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Clean up the celebrity name for Wikipedia search
        const cleanName = celebrityName.replace(/\s+/g, '_');
        
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch from Wikipedia');
        }

        const data: WikipediaImageResponse = await response.json();
        
        if (data.query?.pages) {
          const pages = Object.values(data.query.pages);
          const page = pages[0];
          
          if (page?.thumbnail?.source) {
            setImageUrl(page.thumbnail.source);
          } else {
            // Fallback: try alternative search
            const alternativeResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(celebrityName)}&limit=1&format=json&origin=*`
            );
            
            if (alternativeResponse.ok) {
              const alternativeData = await alternativeResponse.json();
              if (alternativeData[1]?.[0]) {
                const altName = alternativeData[1][0].replace(/\s+/g, '_');
                const altImageResponse = await fetch(
                  `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(altName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`
                );
                
                if (altImageResponse.ok) {
                  const altImageData: WikipediaImageResponse = await altImageResponse.json();
                  if (altImageData.query?.pages) {
                    const altPages = Object.values(altImageData.query.pages);
                    const altPage = altPages[0];
                    if (altPage?.thumbnail?.source) {
                      setImageUrl(altPage.thumbnail.source);
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching Wikipedia image:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [celebrityName]);

  return { imageUrl, isLoading, error };
};
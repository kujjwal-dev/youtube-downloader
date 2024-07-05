import React, { useState, useEffect, useRef } from 'react';
import '@radix-ui/themes/styles.css';
import axios from 'axios';
import { AspectRatio } from '@radix-ui/themes';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

function Hero() {
  const [url, setUrl] = useState('');
  const [formatVideos, setFormatVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [sessionId] = useState(uuidv4()); // Generate a unique session ID
  const [downloadWithSoundProgress, setDownloadWithSoundProgress] = useState(0);

  const gridRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000');
    websocket.onopen = () => {
      websocket.send(JSON.stringify({ sessionId }));
    };
    websocket.onmessage = (event) => {
      const progress = JSON.parse(event.data);
      console.log(progress)
      const { total_size, out_time } = progress;
      // Convert total_size from bytes to megabytes (MB) with 2 decimal places
      const sizeInMB = (parseInt(total_size, 10) / (1024 * 1024)).toFixed(2);
      // out_time is already in a readable format, but you can customize it further if needed
      // Display the progress
      console.log(`Downloaded: ${sizeInMB} MB, Duration processed: ${out_time}`);
      setDownloadWithSoundProgress(sizeInMB);
    };
    websocket.onclose = () => console.log('WebSocket closed');
    websocket.onerror = (error) => console.log('WebSocket error', error);
    return () => websocket.close();
  }, [sessionId]);

  const getFormatVideos = async () => {
    // Scroll to the grid immediately
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'auto' }); // 'auto' for instant scrolling
    }

    setLoading(true);
    try {
      const data = await axios.get(`${import.meta.env.VITE_BASE_URL}/formats?url=${url}`);
      if (!data?.data) throw new Error('No data');
      setFormatVideos(data?.data?.formats);
    } catch (error) {
      console.log(error?.response?.data);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  async function downloadVideo(format) {
    setDownloadProgress(0);
    setDownload(true);
    try {
      if (!format) {
        return alert('Please select a format');
      }
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/download?url=${url}&itag=${format}&sessionId=${sessionId}`);

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        setDownloadProgress(prev => prev + value.length);
      }

      const blob = new Blob(chunks);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'video.mp4';
      document.body.HeroendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setDownload(false);
    }
  }

  async function downloadVideoWithSound(format) {
    setDownloadProgress(0);
    setDownload(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/mix?url=${url}&itag=${format}&sessionId=${sessionId}`);
      console.log(response);

      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'video.mp4';
      document.body.HeroendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setDownload(false);
    }
  }

  return (
    <>
      {download ? (
        <div className="flex justify-center items-center animate-pulse text-center mt-50">
          <svg width="200" height="200" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          <h1>
            {downloadProgress === 0 ? null :
              <>
                {(downloadProgress / (1024 * 1024)).toFixed(2)} MB
                <hr />
              </>
            }
            {
              downloadWithSoundProgress === 0 ? null :
                <>
                  {downloadWithSoundProgress} MB
                  <hr />
                </>
            }
            Downloading...
          </h1>
        </div>
      ) : (
        <>
          <div className=" h-screen flex items-center justify-center">
            <img src="image2.jpeg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg text-center text-white w-full max-w-xl">
              <h1 className=" relative text-4xl font-bold mb-4">YouTube Downloader</h1>
              <p className="text-xl mb-6">Drop the video link below and click the button</p>
              <input
                type="text"
                className="w-full max-w-md h-14 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 text-black mb-4"
                placeholder="Paste the YouTube URL here"
                onChange={(e) => setUrl(e.target.value)}
              />
              <button disabled={!url} onClick={() => { getFormatVideos(); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Let's Go</button>
            </div>
          </div>
          <div ref={gridRef} className="card container mx-auto mt-10">
            {loading || formatVideos?.length > 0 ? (
               <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center items-center">
                {formatVideos?.length > 0 ? (
                  formatVideos?.map((data, index) => {
                    console.log(data)
                    return (
                      <div key={index} className="card-body shadow-md p-4">
                        <div className="flex justify-between">
                          <h6 className="card-subtitle mb-2 text-muted gap-4 ">
                            Audio: {data?.hasAudio ? 'yes' : 'No '}
                          </h6>
                          <h6>
                            {data?.audioBitrate ? (
                              <h6>
                                Audio Birate: {'  '}
                                {data?.audioBitrate ? data?.audioBitrate : null}
                              </h6>
                            ) : null}
                          </h6>
                        </div>
                        <h6>Bitrate: {data?.bitrate}</h6>
                        <AspectRatio ratio={16 / 8}>
                          <video src={data?.url} controls className="w-full h-full"></video>
                        </AspectRatio>
                        <h6 className="font-bold underline p-2">
                          Size : {(data?.contentLength / (1024 * 1024)).toFixed(2)} MB
                        </h6>
                        
                        <div className='flex flex-col gap-2'>
                        {/* Download button */}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          <a onClick={() => { downloadVideo(data?.itag); }} download>
                            Download {data?.qualityLabel}
                          </a>
                        </button>
                        {/* Download with sound button */}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          <a onClick={() => { downloadVideoWithSound(data?.itag); }} download>
                            Download with sound {data?.qualityLabel}
                          </a>
                        </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-screen ml-50%">
                  <svg
                    className="w-48 h-48 animate-spin text-center"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                
                
                )}
              </div>
            ) : (
              <h1>{error?.response?.data || 'Enter the url and click on Lets go'}</h1>
            )}
          </div>
        </>
      )}
    </>

  );
}

export default Hero;

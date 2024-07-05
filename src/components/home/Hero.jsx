import React, { useState, useEffect, useRef } from 'react';
import '@radix-ui/themes/styles.css';
import axios from 'axios';
import { AspectRatio } from '@radix-ui/themes';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import Video from '../animations/Video.json';
import Download from '../animations/Download.json';
import Lottie from 'lottie-react';

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
  const downloadRef = useRef(null);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {download ? (
        <div   className="flex justify-center items-center  text-center mt-[222px]">

          <Lottie  animationData={Download} loop={true} />

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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={scrollToTop}>
                          <a onClick={() => { downloadVideo(data?.itag); }} download>
                            Download {data?.qualityLabel}
                          </a>
                        </button>
                        {/* Download with sound button */}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={scrollToTop}>
                          <a onClick={() => { downloadVideoWithSound(data?.itag); }} download>
                            Download with sound {data?.qualityLabel}
                          </a>
                        </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-screen">
                    <Lottie animationData={Video} style={{ width: '50%', height: '50%' }} />
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

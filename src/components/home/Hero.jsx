import React from 'react';

const Hero = () => {
  return (
    <div className=" h-screen flex items-center justify-center">
      <img src="coding.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg text-center text-white w-full max-w-xl">
        <h1 className=" relative text-4xl font-bold mb-4">YouTube Downloader</h1>
        <p className="text-xl mb-6">Drop the video link below and click the button</p>
        <input
          type="text"
          className="w-full max-w-md h-14 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 text-black mb-4"
          placeholder="Paste the YouTube URL here"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Let's Go</button>
      </div>
    </div>
  );
}

export default Hero;

import React from 'react'
import "./Features.css"

const FeatureData = ({heading,text,images}) => {
  return (
    <div className='first-fea'>
        <div className='fea-text'>
            <h2>{heading}</h2>
            <p>{text}</p>
        </div>
        <div className="image">
        {images.map((image, index) => (
          <img key={index} alt={image.alt} src={image.src} />
        ))}
      </div>
    </div>
  )
}

export default FeatureData
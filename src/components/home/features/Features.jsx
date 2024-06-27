import React from 'react';
import './Features.css';
import FeatureData from './FeatureData';

const Features = () => {
  return (
    <div className='features'>
      <h1>Features</h1>
      <p>dasdsaadsdsasdadas</p>

      <FeatureData 
        heading="adsdsadas"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        images={[
          { alt:'',src:''},
          {alt:'',src:''}
        ]}  
      />

<FeatureData 
        heading="adsdsadas"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        images={[
          { alt:'',src:''},
          {alt:'',src:''}
        ]}  
      />
    </div>
  );
};

export default Features;

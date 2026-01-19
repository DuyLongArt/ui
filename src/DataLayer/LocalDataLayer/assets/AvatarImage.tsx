//
import React, { useEffect, useState } from 'react';
// @ts-ignore
import AvatarImageSrc from "./Avatar.png";
import axios from 'axios';

// Option 1: Simple functional component
export const AvatarImage: React.FC<{ width: number, height: number, networkUrl: string }> = ({ width, height, networkUrl }) => {

  // networkUrl = "http://192.168.22.4:9000/duylongwebappobjectdatabase/admin.png"

  // const [imgSrc, setImgSrc] = useState(networkUrl);
  // useEffect(() => {
  //   if (networkUrl) {
  //     setImgSrc(networkUrl);
  //   }
  // }, [networkUrl]);

  // const [isLoaded, setIsLoaded] = useState(false);
  // // const [isReady,setI]
  // const [imgSrc, setImgSrc] = useState(networkUrl || AvatarImageSrc);

  // const [isReady, setIsReady] = useState(false);
  // // 2. IMPORTANT: Update the image source when the prop finally arrives from the network
  // useEffect(() => {
  //   if (networkUrl) {
  //     setImgSrc(networkUrl);
  //     axios.get(networkUrl).then((response) => {
  //       setIsReady(true);
  //     })
  //   }
  // }, [isReady]);

  // console.log("network: " + networkUrl)




  return (
    <div style={{ width: `${width}px`, height: `${height}px`, clipPath: 'circle(50%)' }} className="overflow-hidden">
      {/* {!isReady && <div className="bg-gray-200 animate-pulse w-full h-full" />}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
      
          <img src={AvatarImageSrc} className="w-full h-full blur-sm opacity-50" alt="loading" />
        </div>
      )} */}

      <img
        src={networkUrl}

        // 👈 Triggers a re-render when bytes arrive
        // style={{ display: isReady ? 'block' : 'none' }}
        className="w-full h-full object-cover bg-amber-50"
      />
    </div>
  );
};

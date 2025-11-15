
"use client";

import React, { useState } from 'react';
import InteractiveWall from '@/components/InteractiveWall';

const HomePage = () => {
  const [isWallDestroyed, setIsWallDestroyed] = useState(false);

  const handleWallDestroyed = () => {
    setIsWallDestroyed(true);
  };

  return (
    <div>
      {!isWallDestroyed && <InteractiveWall onWallDestroyed={handleWallDestroyed} />}
      {isWallDestroyed && (
        <div>
          <h1>Wall Destroyed!</h1>
          <p>You have successfully destroyed the wall.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

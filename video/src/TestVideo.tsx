import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const TestVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.sin(frame / 10) * 0.5 + 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b' }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#f97316',
        fontSize: 80,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        opacity,
      }}>
        Sparky Test
      </div>
    </AbsoluteFill>
  );
};
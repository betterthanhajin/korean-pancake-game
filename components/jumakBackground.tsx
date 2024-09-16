"use client" ;
import React from 'react';

interface JumakBackgroundProps {
  width: number;
  height: number;
}

const JumakBackground: React.FC<JumakBackgroundProps> = ({ width, height }) => {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="woodPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <rect width="20" height="20" fill="#d2a679" />
          <rect width="1" height="20" fill="#b78956" />
        </pattern>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FFFAE6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFF7D6" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background */}
      <rect width={width} height={height} fill="#0F1729" />
      
      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * width}
          cy={Math.random() * height * 0.6}
          r={width * 0.002}
          fill="#FFFFFF"
          opacity={Math.random() * 0.8 + 0.2}
        />
      ))}
      
      {/* Moon glow */}
      <circle cx={width * 0.8} cy={height * 0.2} r={height * 0.15} fill="url(#moonGlow)" />
      
      {/* Moon */}
      <circle cx={width * 0.8} cy={height * 0.2} r={height * 0.08} fill="#FFF7D6" />
      
      {/* Floor */}
      <rect y={height * 0.8} width={width} height={height * 0.2} fill="#8B4513" />
      
      {/* Back wall */}
      <rect x={width * 0.1} y={height * 0.5} width={width * 0.8} height={height * 0.3} fill="#d2a679" />
      
      {/* Roof */}
      <path d={`M0 ${height * 0.5} L${width * 0.1} ${height * 0.5} L${width * 0.2} ${height * 0.4} L${width * 0.8} ${height * 0.4} L${width * 0.9} ${height * 0.5} L${width} ${height * 0.5}`} fill="#8B4513" />
      
      {/* Side walls */}
      <path d={`M0 ${height * 0.5} L${width * 0.1} ${height * 0.5} L${width * 0.1} ${height * 0.8} L0 ${height * 0.85} Z`} fill="url(#woodPattern)" />
      <path d={`M${width} ${height * 0.5} L${width * 0.9} ${height * 0.5} L${width * 0.9} ${height * 0.8} L${width} ${height * 0.85} Z`} fill="url(#woodPattern)" />
      
      {/* Counter */}
      <rect x={width * 0.2} y={height * 0.65} width={width * 0.6} height={height * 0.08} fill="#8B4513" />
      <rect x={width * 0.2} y={height * 0.73} width={width * 0.6} height={height * 0.02} fill="#d2a679" />
      
      {/* Shelves */}
      <rect x={width * 0.15} y={height * 0.53} width={width * 0.7} height={height * 0.015} fill="#8B4513" />
      <rect x={width * 0.15} y={height * 0.59} width={width * 0.7} height={height * 0.015} fill="#8B4513" />
      
      {/* Bottles and jars */}
      {[...Array(10)].map((_, i) => (
        <rect key={i} x={width * (0.2 + i * 0.07)} y={height * 0.545} width={width * 0.04} height={height * 0.04} fill="#5c3317" />
      ))}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={width * (0.25 + i * 0.07)} y={height * 0.605} width={width * 0.05} height={height * 0.05} fill="#8B4513" />
      ))}
      
      {/* Lanterns */}
      <circle cx={width * 0.3} cy={height * 0.45} r={height * 0.03} fill="#FFD700" />
      <circle cx={width * 0.7} cy={height * 0.45} r={height * 0.03} fill="#FFD700" />
    </svg>
  );
};

export default JumakBackground;
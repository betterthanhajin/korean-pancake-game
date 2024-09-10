"use client";
import React, { useState } from "react";

interface JeonType {
  color: string;
  cookTime: number;
  name: string;
}

interface JeonTypes {
  [key: string]: JeonType;
}

const JeonTypes: JeonTypes = {
  kimchi: { color: "#ffa502", cookTime: 5000, name: "김치전" },
  pa: { color: "#7bed9f", cookTime: 4000, name: "파전" },
  gogi: { color: "#ff6b6b", cookTime: 6000, name: "고기전" },
  hobak: { color: "#eccc68", cookTime: 4500, name: "호박전" },
  gamja: { color: "#dfe4ea", cookTime: 5500, name: "감자전" },
};

interface Position {
  x: number;
  y: number;
}

interface JeonProps {
  type: keyof JeonTypes;
  position: Position;
  isFlipped: boolean;
  isBurnt: boolean;
  onClick: () => void;
}

const Jeon: React.FC<JeonProps> = ({
  type,
  position,
  isFlipped,
  isBurnt,
  onClick,
}) => {
  const jeonStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: JeonTypes[type].color,
    transform: isFlipped ? "scaleY(-1)" : "none",
    filter: isBurnt ? "brightness(50%)" : "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "bold",
    color: "black",
    transition: "transform 0.3s, filter 0.3s",
  };

  const faceStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    transform: isFlipped ? "scaleY(-1)" : "none",
  };

  return (
    <div style={jeonStyle} onClick={onClick}>
      <div style={faceStyle}>
        {/* Left eye */}
        <div
          style={{
            position: "absolute",
            left: "25%",
            top: "30%",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "black",
          }}
        />
        {/* Right eye */}
        <div
          style={{
            position: "absolute",
            right: "25%",
            top: "30%",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "black",
          }}
        />
        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "25%",
            width: "20px",
            height: "10px",
            borderRadius: "0 0 10px 10px",
            border: "2px solid black",
            borderTop: "none",
            transform: "translateX(-50%)",
          }}
        />
        <div style={{ marginTop: "70%" }}>{JeonTypes[type].name}</div>
      </div>
    </div>
  );
};

const Pan: React.FC = () => {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300">
      <defs>
        <radialGradient
          id="panGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#888888" />
          <stop offset="70%" stopColor="#666666" />
          <stop offset="100%" stopColor="#444444" />
        </radialGradient>
        <filter id="panShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Pan body */}
      <ellipse
        cx="200"
        cy="150"
        rx="180"
        ry="120"
        fill="url(#panGradient)"
        filter="url(#panShadow)"
      />

      {/* Pan rim */}
      <ellipse
        cx="200"
        cy="150"
        rx="175"
        ry="115"
        fill="none"
        stroke="#333333"
        strokeWidth="5"
      />

      {/* Pan handle */}
      <path
        d="M375 150 Q400 150 400 130 L400 170 Q400 150 375 150"
        fill="#333333"
      />

      {/* Pan surface */}
      <ellipse cx="200" cy="150" rx="160" ry="100" fill="#555555" />

      {/* Surface texture */}
      <g opacity="0.1">
        <circle cx="140" cy="120" r="10" fill="#999999" />
        <circle cx="180" cy="100" r="15" fill="#999999" />
        <circle cx="220" cy="140" r="12" fill="#999999" />
        <circle cx="260" cy="110" r="8" fill="#999999" />
      </g>
    </svg>
  );
};

interface Jeon {
  id: number;
  type: keyof JeonTypes;
  position: Position;
  isFlipped: boolean;
  isBurnt: boolean;
}

const PancakeGame: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [jeons, setJeons] = useState<Jeon[]>([]);

  const addJeon = (type: keyof JeonTypes) => {
    if (jeons.length >= 5) return;

    // Calculate position within the ellipse
    const a = 140; // horizontal radius
    const b = 80; // vertical radius
    const t = Math.random() * 2 * Math.PI;
    const x = 200 + a * Math.cos(t);
    const y = 150 + b * Math.sin(t);

    const newJeon: Jeon = {
      id: Date.now(),
      type,
      position: { x, y },
      isFlipped: false,
      isBurnt: false,
    };

    setJeons((prevJeons) => [...prevJeons, newJeon]);
    setTimeout(() => burnJeon(newJeon.id), JeonTypes[type].cookTime);
  };

  const flipJeon = (id: number) => {
    setJeons((prevJeons) =>
      prevJeons.map((jeon) =>
        jeon.id === id ? { ...jeon, isFlipped: true } : jeon
      )
    );
    setScore((prevScore) => prevScore + 5);
  };

  const removeJeon = (id: number) => {
    setJeons((prevJeons) => prevJeons.filter((jeon) => jeon.id !== id));
    setScore((prevScore) => prevScore + 10);
  };

  const burnJeon = (id: number) => {
    setJeons((prevJeons) =>
      prevJeons.map((jeon) =>
        jeon.id === id && !jeon.isFlipped ? { ...jeon, isBurnt: true } : jeon
      )
    );
    setTimeout(() => removeJeon(id), 2000);
  };

  const handleJeonClick = (jeon: Jeon) => {
    if (jeon.isBurnt) return;
    if (jeon.isFlipped) {
      removeJeon(jeon.id);
    } else {
      flipJeon(jeon.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <h1 className="text-4xl font-bold mb-4">전 부치기 게임</h1>
      <div className="text-2xl mb-4">점수: {score}</div>
      <div className="relative mb-4">
        <Pan />
        {jeons.map((jeon) => (
          <Jeon
            key={jeon.id}
            type={jeon.type}
            position={jeon.position}
            isFlipped={jeon.isFlipped}
            isBurnt={jeon.isBurnt}
            onClick={() => handleJeonClick(jeon)}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        {(Object.keys(JeonTypes) as Array<keyof JeonTypes>).map((type) => (
          <button
            key={type}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => addJeon(type)}
          >
            {JeonTypes[type].name} 추가
          </button>
        ))}
      </div>
    </div>
  );
};

export default PancakeGame;

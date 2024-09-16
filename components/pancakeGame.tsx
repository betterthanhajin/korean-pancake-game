"use client";
import React, { useState, useEffect, useRef } from "react";

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
  size: number;
}

const Jeon: React.FC<JeonProps> = ({
  type,
  position,
  isFlipped,
  isBurnt,
  onClick,
  size,
}) => {
  const jeonStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: JeonTypes[type].color,
    transform: isFlipped ? "scaleY(-1)" : "none",
    filter: isBurnt ? "brightness(50%)" : "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: `${size / 6}px`,
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

  const eyeStyle: React.CSSProperties = {
    position: "absolute",
    width: isFlipped ? `${size / 6}px` : `${size / 7.5}px`,
    height: isFlipped ? `${size / 6}px` : `${size / 7.5}px`,
    borderRadius: "50%",
    backgroundColor: "black",
    top: "30%",
  };

  const mouthStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    bottom: "25%",
    width: `${size / 3}px`,
    height: `${size / 6}px`,
    transform: "translateX(-50%)",
  };

  if (isBurnt) {
    Object.assign(mouthStyle, {
      borderRadius: `${size / 6}px ${size / 6}px 0 0`,
      border: `${size / 30}px solid black`,
      borderBottom: "none",
    });
  } else if (isFlipped) {
    Object.assign(mouthStyle, {
      width: `${size / 5}px`,
      height: `${size / 5}px`,
      borderRadius: "50%",
      border: `${size / 30}px solid black`,
    });
  } else {
    Object.assign(mouthStyle, {
      borderRadius: `0 0 ${size / 6}px ${size / 6}px`,
      border: `${size / 30}px solid black`,
    });
  }

  return (
    <div style={jeonStyle} onClick={onClick}>
      <div style={faceStyle}>
        <div style={{...eyeStyle, left: "25%"}} />
        <div style={{...eyeStyle, right: "25%"}} />
        <div style={mouthStyle} />
      </div>
    </div>
  );
};

interface PanProps {
  width: number;
  height: number;
}

const Pan: React.FC<PanProps> = ({ width, height }) => {
  return (
    <div className="relative mb-4" style={{ width: `${width}px`, height: `${height}px` }}>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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
        cx={width / 2}
        cy={height / 2}
        rx={width * 0.45}
        ry={height * 0.4}
        fill="url(#panGradient)"
        filter="url(#panShadow)"
      />

      {/* Pan rim */}
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width * 0.44}
        ry={height * 0.38}
        fill="none"
        stroke="#333333"
        strokeWidth={width * 0.01}
      />

      {/* Pan surface */}
      <ellipse 
        cx={width / 2} 
        cy={height / 2} 
        rx={width * 0.4} 
        ry={height * 0.33} 
        fill="#555555" 
      />

      {/* Surface texture */}
      <g opacity="0.1">
        <circle cx={width * 0.35} cy={height * 0.4} r={width * 0.025} fill="#999999" />
        <circle cx={width * 0.45} cy={height * 0.33} r={width * 0.0375} fill="#999999" />
        <circle cx={width * 0.55} cy={height * 0.47} r={width * 0.03} fill="#999999" />
        <circle cx={width * 0.65} cy={height * 0.37} r={width * 0.02} fill="#999999" />
      </g>
    </svg>
  </div>
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
  const [panSize, setPanSize] = useState({ width: 400, height: 300 });
  const [jeonSize, setJeonSize] = useState(60);
  const alramRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(400, window.innerWidth - 40);
      const height = width * 0.75;
      setPanSize({ width, height });
      setJeonSize(Math.max(30, width * 0.15));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const distance = (p1: Position, p2: Position): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isColliding = (newPosition: Position, existingJeons: Jeon[], minDistance: number): boolean => {
    return existingJeons.some(jeon => distance(newPosition, jeon.position) < minDistance);
  };

  const generateRandomPosition = (panWidth: number, panHeight: number, jeonSize: number): Position => {
    const effectivePanWidth = panWidth / 2;  // 실제 팬의 너비
    const effectivePanHeight = panHeight / 2;  // 실제 팬의 높이

    const t = Math.random() * 2 * Math.PI;
    const maxX = effectivePanWidth - jeonSize;
    const maxY = effectivePanHeight - jeonSize;
    const x = (maxX / 2) * Math.cos(t) + panWidth / 2;
    const y = (maxY / 2) * Math.sin(t) + panHeight / 2;


    return {
      x: Math.max(jeonSize / 2, Math.min(x, panWidth - jeonSize / 2)),
      y: Math.max(jeonSize / 2, Math.min(y, panHeight - jeonSize / 2))
    };
  };

  const addJeon = (type: keyof JeonTypes) => {
    if (jeons.length >= 5) return;

    const minDistance = jeonSize + 10;
    const maxAttempts = 50;

    let newPosition: Position;
    let attempts = 0;

    do {
      newPosition = generateRandomPosition(panSize.width, panSize.height, jeonSize);
      attempts++;
    } while (isColliding(newPosition, jeons, minDistance) && attempts < maxAttempts);

    const newJeon: Jeon = {
      id: Date.now(),
      type,
      position: newPosition,
      isFlipped: false,
      isBurnt: false,
    };

    setJeons((prevJeons) => [...prevJeons, newJeon]);
    setTimeout(() => burnJeon(newJeon.id, newJeon.type), JeonTypes[type].cookTime);
  };

  const flipJeon = (id: number, type:keyof JeonTypes) => {
    setJeons((prevJeons) =>
      prevJeons.map((jeon) =>
        jeon.id === id ? { ...jeon, isFlipped: true } : jeon
      )
    );
    if (alramRef.current) {
      alramRef.current.textContent = `${JeonTypes[type].name}이 뒤집어졌습니다!`;
    }
    setScore((prevScore) => prevScore + 5);

  };

  const removeJeon = (id: number) => {
    setJeons((prevJeons) => prevJeons.filter((jeon) => jeon.id !== id));
    setScore((prevScore) => prevScore + 10);
    if (alramRef.current) {
      alramRef.current.textContent = "";
    }
  };

  const burnJeon = (id: number, type: keyof JeonTypes) => {
    setJeons((prevJeons) =>
      prevJeons.map((jeon) =>
        jeon.id === id && !jeon.isFlipped ? { ...jeon, isBurnt: true } : jeon
      )
    );
    if (alramRef.current) {
      alramRef.current.textContent = `${JeonTypes[type].name}이 타버렸네요!!`;
    }
    setScore((prevScore) => prevScore - 10);
    setTimeout(() => removeJeon(id), 2000);
  };

  const handleJeonClick = (jeon: Jeon) => {
    if (jeon.isBurnt) return;
    if (jeon.isFlipped) {
      removeJeon(jeon.id);
    } else {
      flipJeon(jeon.id, jeon.type);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">전 부치기 게임</h1>
      {score >= 50 ?(
        <div className="text-xl sm:text-2xl mb-4">점수가 {score}점 !! 수고하셨습니다</div>
      ) : (
        <div className="text-xl sm:text-2xl mb-4">점수: {score}</div>
      )}
      <div className="relative mb-4">
        <Pan width={panSize.width} height={panSize.height} />
        {jeons.map((jeon) => (
          <Jeon
            key={jeon.id}
            type={jeon.type}
            position={jeon.position}
            isFlipped={jeon.isFlipped}
            isBurnt={jeon.isBurnt}
            onClick={() => handleJeonClick(jeon)}
            size={jeonSize}
          />
        ))}
      </div>
      <p className="text-lg text-red-500 font-semibold" ref={alramRef}>&nbsp;</p>
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(JeonTypes) as Array<keyof JeonTypes>).map((type) => (
          <button
            key={type}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
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
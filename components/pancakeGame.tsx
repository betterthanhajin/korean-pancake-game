"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image,{StaticImageData} from "next/image";
import kimchi from "../public/kimchi.png";
import meat from "../public/meat.png";
import group from "../public/group.png";
import pa from "../public/pa.png";
import JumakBackground from "./jumakBackground";

interface JeonType {
  color: string;
  cookTime: number;
  name: string;
  image: StaticImageData;
}

interface JeonTypes {
  [key: string]: JeonType;
}
const JeonTypes: JeonTypes = {
  kimchi: { color: "#ffa502", cookTime: 8000, name: "김치전", image: kimchi },
  pa: { color: "#7bed9f", cookTime: 7000, name: "파전", image: pa },
  gogi: { color: "#ff6b6b", cookTime: 6000, name: "고기전", image: meat },
  hobak: { color: "#eccc68", cookTime: 9000, name: "모듬전", image: group },
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
  remainingTime: number;
}

const Jeon: React.FC<JeonProps> = ({
  type,
  position,
  isFlipped,
  isBurnt,
  onClick,
  size,
  remainingTime,
}) => {
  const jeonStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    transform: isFlipped ? "scaleY(-1)" : "none",
    filter: isBurnt ? "brightness(50%) sepia(100%) saturate(300%) hue-rotate(320deg)" : "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s, filter 0.3s",
  };

  const timerStyle: React.CSSProperties = {
    position: "absolute",
    top: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    fontWeight: "bold",
    color: remainingTime <= 3000 ? "red" : "black",
  };

  return (
    <div onClick={onClick} style={jeonStyle}>
      <Image src={JeonTypes[type].image} alt={JeonTypes[type].name} width={60} height={60}/>
      {!isFlipped && !isBurnt && (
        <div style={timerStyle}>{Math.ceil(remainingTime / 1000)}s</div>
      )}
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
  remainingTime: number;
}

const PancakeGame: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [jeons, setJeons] = useState<Jeon[]>([]);
  const [panSize, setPanSize] = useState({ width: 400, height: 300 });
  const [jeonSize, setJeonSize] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<string>("");
  const browserWidth = useRef(0);
  const browserHeight = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      browserWidth.current = window.innerWidth;
      browserHeight.current = window.innerHeight;
    }
    setBackgroundSize({ width: browserWidth.current, height: browserHeight.current  });
  }, []);

  const [backgroundSize, setBackgroundSize] = useState({ width: 0, height:0 });

 


  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(400, window.innerWidth * 0.9);
      const height = width * 0.75;
      setPanSize({ width, height });
      setJeonSize(Math.max(30, width * 0.15));
      setBackgroundSize({ width: window.innerWidth, height: window.innerHeight });
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (score >= 150 && !gameOver) {
      setMessage("축하합니다! 게임 클리어!");
      setGameOver(true);
    }
  }, [score, gameOver]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        setJeons((prevJeons) =>
          prevJeons.map((jeon) => ({
            ...jeon,
            remainingTime: Math.max(0, jeon.remainingTime - 1000),
          }))
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const updateScore = useCallback((points: number) => {
    if (!gameOver) {
      setScore((prevScore) => {
        const newScore = Math.max(0, prevScore + points);
        return newScore >= 150 ? 150 : newScore;
      });
    }
  }, [gameOver]);


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
    if(gameOver ||jeons.length >= 5 ){
      return;
    }

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
      remainingTime: JeonTypes[type].cookTime,
    };

    setJeons((prevJeons) => [...prevJeons, newJeon]);
    setTimeout(() => burnJeon(newJeon.id, newJeon.type), JeonTypes[type].cookTime);
  };

  const flipJeon = (id: number, type: keyof JeonTypes) => {
    if (!gameOver) {
      setJeons((prevJeons) =>
        prevJeons.map((jeon) =>
          jeon.id === id ? { ...jeon, isFlipped: true } : jeon
        )
      );
      setMessage(`${JeonTypes[type].name}이 뒤집어졌습니다!`);
    }
  };

  const removeJeon = (id: number) => {
    if (!gameOver) {
      setJeons((prevJeons) => prevJeons.filter((jeon) => jeon.id !== id));
      updateScore(10);
      setMessage("");
    }
  };

  const burnJeon = (id: number, type: keyof JeonTypes) => {
    if (!gameOver) {
      setJeons((prevJeons) =>
        prevJeons.map((jeon) =>
          jeon.id === id && !jeon.isFlipped ? { ...jeon, isBurnt: true } : jeon
        )
      );
      setMessage(`${JeonTypes[type].name}이 타버렸네요!!`);
      updateScore(-10);
      setTimeout(() => removeJeon(id), 3000);
    }
  };

  const handleJeonClick = (jeon: Jeon) => {
    if (gameOver || jeon.isBurnt) return;
    if (jeon.isFlipped) {
      removeJeon(jeon.id);
    } else {
      flipJeon(jeon.id, jeon.type);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <JumakBackground width={backgroundSize.width} height={backgroundSize.height} />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center p-2 sm:p-4 bg-yellow-100 bg-opacity-70 rounded-lg max-w-[95%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] mx-auto my-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center text-brown-800">추석맞이 전 부치기 게임</h1>
        <div className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 text-brown-600">
          점수: {score}점
        </div>
        <div className="relative mb-2 sm:mb-4" style={{
          width: `${panSize.width}px`,
          height: `${panSize.height}px`,
          maxWidth: '100%',
          maxHeight: '50vh'
        }}>
          <Pan width={panSize.width} height={panSize.height} />
          {score >= 150 && gameOver && (
            <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-500 bg-brown-800 bg-opacity-80">
              게임 클리어!</p>
          )}
          {jeons.map((jeon) => (
            <Jeon
              key={jeon.id}
              type={jeon.type}
              position={jeon.position}
              isFlipped={jeon.isFlipped}
              isBurnt={jeon.isBurnt}
              onClick={() => handleJeonClick(jeon)}
              size={jeonSize}
              remainingTime={jeon.remainingTime}
            />
          ))}
        </div>
        <p className="text-sm sm:text-base md:text-lg text-red-500 font-semibold h-4 sm:h-6 mb-2">{message}</p>
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {(Object.keys(JeonTypes) as Array<keyof JeonTypes>).map((type) => (
            <button
              key={type}
              className="px-2 py-1 sm:px-3 sm:py-1 bg-brown-500 text-white rounded hover:bg-brown-600 transition text-xs sm:text-sm md:text-base font-bold"
              onClick={() => addJeon(type)}
              disabled={gameOver}
            >
              {JeonTypes[type].name} 추가
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PancakeGame;
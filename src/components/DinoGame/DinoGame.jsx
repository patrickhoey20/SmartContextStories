import React, { useState, useEffect, useRef } from 'react';
import "./DinoGame.css";

export const DinoGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dinoRef = useRef(null);

  const startGame = () => {
    setIsRunning(true);
    setScore(0);
    setIsGameOver(false);
  };

  const handleJump = () => {
    if (!isJumping) {
      setIsJumping(true);
      dinoRef.current.classList.add('jump');

      setTimeout(() => {
        setIsJumping(false);
        dinoRef.current.classList.remove('jump');
      }, 1000);
    }
  };

  const handleGameOver = () => {
    setIsRunning(false);
    setIsGameOver(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 32 || e.keyCode === 38) {
        handleJump();
      } else if (e.keyCode === 13 && !isRunning) {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRunning]);

  useEffect(() => {
    let scoreInterval;
    if (isRunning && !isGameOver) {
      scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 100);
    }

    return () => {
      clearInterval(scoreInterval);
    };
  }, [isRunning, isGameOver]);

  return (
    <div className="dino-game">
      <div className="dino" ref={dinoRef}></div>
      <div className="ground"></div>
      {isGameOver && (
        <div className="game-over">
          <h1>Game Over</h1>
          <p>Press Enter to Restart</p>
        </div>
      )}
      <div className="score">Score: {score}</div>
      {!isRunning && (
        <div className="start-message">
          <p>Press Enter to Start</p>
        </div>
      )}
    </div>
  );
};
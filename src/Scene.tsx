import { useEffect, useRef, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { Howl } from 'howler';
import { gsap } from 'gsap';
import { useDiceState } from './hooks/useDiceState';
import { useBoardState } from './hooks/useBoardState';

function Scene() {
  const [audioTexture, setAudioTexture] = useState<Texture | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(100);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const hoverSoundRef = useRef<Howl | null>(null);
  const bgmSoundRef = useRef<Howl | null>(null);
  const graphicsRef = useRef<any>(null);
  const audioSpriteRef = useRef<any>(null);
  const audioTextRef = useRef<any>(null);

  const { diceState, rollDice, isMockMode } = useDiceState();
  const {
    boardState,
    generateBoard,
    isMockMode: isMockModeBoard,
  } = useBoardState();

  useEffect(() => {
    let isMounted = true;
    Assets.load('/assets/main/audio.png').then((res) => {
      if (!isMounted) return;
      const tex =
        res instanceof Texture ? res : Texture.from('/assets/main/audio.png');
      setAudioTexture(tex);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const sound = new Howl({
      src: [
        '/assets/main/sounds/sfx-hover.mp3',
        '/assets/main/sounds/sfx-hover.ogg',
      ],
      volume: 0.5,
      preload: true,
    });
    hoverSoundRef.current = sound;
    return () => {
      sound.unload();
      hoverSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const bgm = new Howl({
      src: ['/assets/main/sounds/komari.mp3'],
      volume: 0.3,
      loop: true,
      preload: true,
    });
    bgmSoundRef.current = bgm;
    return () => {
      bgm.unload();
      bgmSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (graphicsRef.current) {
      graphicsRef.current.pivot.set(25, 25);
    }
  }, []);

  // Initialize board once on mount
  useEffect(() => {
    generateBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance selected square whenever dice result arrives and update balance
  useEffect(() => {
    if (!diceState.dice) return;
    const steps = diceState.dice[0] + diceState.dice[1];
    setSelectedIndex((prev) => {
      const nextIndex = (prev + steps) % 16;
      if (boardState.board) {
        const landed = boardState.board[nextIndex];
        const prize = typeof landed === 'number' ? landed : 0;
        setBalance((prevBal) => prevBal - 50 + prize);
        console.log('Balance update:', { prevBalance: undefined, steps, landed, prize });
      }
      return nextIndex;
    });
  }, [diceState.dice]);

  // Log selected cell value when it changes
  useEffect(() => {
    if (!boardState.board) return;
    const value = boardState.board[selectedIndex];
    console.log('Selected board cell:', value);
  }, [boardState.board, selectedIndex]);

  // Detect loss condition and refresh
  useEffect(() => {
    if (balance <= 0) {
      // Simple JS prompt/alert then refresh
      window.alert('you lost, try again');
      window.location.reload();
    }
  }, [balance]);

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);

    const bgm = bgmSoundRef.current;
    if (bgm) {
      if (newAudioState) {
        bgm.play();
      } else {
        bgm.stop();
      }
    }
  };

  return (
    <pixiContainer x={0} y={0}>
      {audioTexture && (
        <pixiSprite
          ref={audioSpriteRef}
          texture={audioTexture}
          x={window.innerWidth - 100}
          y={100}
          anchor={{ x: 0.5, y: 0.5 }}
          width={100}
          height={100}
          eventMode='static'
          onPointerDown={toggleAudio}
        />
      )}

      <pixiText
        ref={audioTextRef}
        text={audioEnabled ? 'click to disable audio' : 'click to enable audio'}
        x={window.innerWidth - 170}
        y={50}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 24,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {/* Balance Display */}
      <pixiText
        text={`Balance: ${balance}`}
        x={100}
        y={80}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 22,
          fill: '#00e676',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        }}
      />

      {/* Dice Roll Button */}
      <pixiGraphics
        x={100}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0x4a90e2);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={rollDice}
        cursor='pointer'
      />

      <pixiText
        text={diceState.isRolling ? 'Rolling...' : 'Roll Dice'}
        x={160}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {diceState.dice && (
        <>
          <pixiText
            text={`Dice 1: ${diceState.dice[0]}`}
            x={100}
            y={280}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Arial',
            }}
          />
          <pixiText
            text={`Dice 2: ${diceState.dice[1]}`}
            x={100}
            y={310}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Arial',
            }}
          />
          <pixiText
            text={`Total: ${diceState.dice[0] + diceState.dice[1]}`}
            x={100}
            y={340}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 24,
              fill: '#ffff00',
              fontFamily: 'Arial',
            }}
          />
        </>
      )}

      <pixiText
        text={`Mode: ${isMockMode ? 'Mock (Local)' : 'Backend'}`}
        x={100}
        y={50}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 18,
          fill: isMockMode ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />


      <pixiText
        text={`Board Mode: ${isMockModeBoard ? 'Mock (Local)' : 'Backend'}`}
        x={300}
        y={170}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 14,
          fill: isMockModeBoard ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />

      {/* Selected Cell Display */}
      {boardState.board && (
        <pixiText
          text={`Selected: ${boardState.board[selectedIndex]}`}
          x={300}
          y={140}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: 16,
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
        />
      )}

      {boardState.board && (
        <>
          {(() => {
            const cellSize = 60;
            const spacing = 20;
            const total = cellSize + spacing;
            const startX = 350;
            const startY = 300;

            const positions: { row: number; col: number }[] = [];
            for (let c = 0; c < 5; c += 1) positions.push({ row: 0, col: c });
            for (let r = 1; r < 4; r += 1) positions.push({ row: r, col: 4 });
            for (let c = 4; c >= 0; c -= 1) positions.push({ row: 4, col: c });
            for (let r = 3; r >= 1; r -= 1) positions.push({ row: r, col: 0 });

            const centerTopLeftX = startX + total * 1;
            const centerTopLeftY = startY + total * 1;
            const centerWidth = total * 3 - spacing;
            const centerHeight = total * 3 - spacing;

            const centerNode = (
              <>
                <pixiGraphics
                  x={centerTopLeftX}
                  y={centerTopLeftY}
                  draw={(g) => {
                    g.clear();
                    g.fill(0x1abc9c);
                    g.rect(0, 0, centerWidth, centerHeight);
                    g.fill();
                    g.stroke({ color: 0x16a085, width: 4 });
                    g.rect(0, 0, centerWidth, centerHeight);
                    g.stroke();
                  }}
                />
                <pixiText
                  text={'monopoly'}
                  x={centerTopLeftX + centerWidth / 2}
                  y={centerTopLeftY + centerHeight / 2}
                  anchor={{ x: 0.5, y: 0.5 }}
                  style={{
                    fontSize: 28,
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                  }}
                />
              </>
            );

            return (
              <>
                {centerNode}
                {boardState.board.map((cell, index) => {
                  const { row, col } = positions[index];
                  const x = startX + col * total;
                  const y = startY + row * total;
                  const isBonus = cell === 'bonus';
                  const isSelected = index === selectedIndex;
                  return (
                    <>
                      <pixiGraphics
                        key={`ring-bg-${index}`}
                        x={x}
                        y={y}
                        draw={(g) => {
                          g.clear();
                          const baseFill = isBonus ? 0xf39c12 : 0x8e44ad;
                          const highlightFill = isBonus ? 0xffc04d : 0xa569bd;
                          g.fill(isSelected ? highlightFill : baseFill);
                          g.rect(0, 0, cellSize, cellSize);
                          g.fill();
                          g.stroke({ color: isSelected ? 0xffff00 : 0x34495e, width: isSelected ? 4 : 2 });
                          g.rect(0, 0, cellSize, cellSize);
                          g.stroke();
                        }}
                      />
                      <pixiText
                        key={`ring-text-${index}`}
                        text={`${cell}`}
                        x={x + cellSize / 2}
                        y={y + cellSize / 2}
                        anchor={{ x: 0.5, y: 0.5 }}
                        style={{
                          fontSize: isSelected ? 18 : 16,
                          fill: isSelected ? '#000000' : '#ffffff',
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                        }}
                      />
                    </>
                  );
                })}
              </>
            );
          })()}
        </>
      )}
    </pixiContainer>
  );
}

export default Scene;

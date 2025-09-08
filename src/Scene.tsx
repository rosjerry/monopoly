import { useEffect, useRef, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { Howl } from 'howler';
import { gsap } from 'gsap';
import { useGameController } from './hooks/useGameController';

function Scene() {
  const [audioTexture, setAudioTexture] = useState<Texture | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isSpinningDice, setIsSpinningDice] = useState<boolean>(false);
  const [displayDice, setDisplayDice] = useState<[number, number] | null>(null);
  const [diceTextures, setDiceTextures] = useState<Record<number, Texture> | null>(null);
  const tickerHandlerRef = useRef<((time: number) => void) | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<{ value: number; color: string } | null>(null);
  const hoverSoundRef = useRef<Howl | null>(null);
  const bgmSoundRef = useRef<Howl | null>(null);
  const graphicsRef = useRef<any>(null);
  const audioSpriteRef = useRef<any>(null);
  const audioTextRef = useRef<any>(null);
  const dice1Ref = useRef<any>(null);
  const dice2Ref = useRef<any>(null);
  const diceTweensRef = useRef<{ t1: gsap.core.Tween | null; t2: gsap.core.Tween | null }>({ t1: null, t2: null });
  const justResetRef = useRef<boolean>(false);

  const game = useGameController();

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

  // board provided by controller

  useEffect(() => {
    if (!game.board) return;
    const value = game.board[currentIndex];
    console.log('Selected board cell:', value);
  }, [game.board, currentIndex]);

  // Sync pawn position to last known prize from backend when not animating
  useEffect(() => {
    if (justResetRef.current) return; // skip if we just reset
    if (!game.board || game.lastPrize == null || isRolling) return;
    const idx = game.board.findIndex((cell) => typeof cell === 'number' && cell === game.lastPrize);
    if (idx >= 0) setCurrentIndex(idx);
  }, [game.board, game.lastPrize, isRolling]);

  // After a backend reset, keep pawn at start when new board arrives
  useEffect(() => {
    if (!game.board) return;
    if (justResetRef.current) {
      setCurrentIndex(0);
      justResetRef.current = false;
    }
  }, [game.board]);

  // Map dice face to asset path
  const diceTextureFor = (n: number) => {
    if (!diceTextures) return null;
    return diceTextures[n];
  };

  useEffect(() => {
    let mounted = true;
    const paths: Record<number, string> = {
      1: '/assets/main/dice/iaqe.png',
      2: '/assets/main/dice/du.png',
      3: '/assets/main/dice/se.png',
      4: '/assets/main/dice/chari.png',
      5: '/assets/main/dice/fanji.png',
      6: '/assets/main/dice/shashi.png',
    };
    Promise.all(Object.values(paths).map((p) => Assets.load(p))).then(() => {
      if (!mounted) return;
      const map: Record<number, Texture> = {
        1: Texture.from(paths[1]),
        2: Texture.from(paths[2]),
        3: Texture.from(paths[3]),
        4: Texture.from(paths[4]),
        5: Texture.from(paths[5]),
        6: Texture.from(paths[6]),
      };
      setDiceTextures(map);
      // initialize with last known dice from backend if present
      if (game.dice) setDisplayDice(game.dice);
    });
    return () => {
      mounted = false;
    };
  }, [game.dice]);

  // keep displayed dice in sync with backend results when not spinning
  useEffect(() => {
    if (!isSpinningDice && game.dice && diceTextures) {
      setDisplayDice(game.dice);
    }
  }, [game.dice, isSpinningDice, diceTextures]);

  const startDiceSpin = () => {
    if (tickerHandlerRef.current) return;
    setIsSpinningDice(true);
    const handler = () => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDisplayDice([d1, d2]);
    };
    tickerHandlerRef.current = handler;
    gsap.ticker.add(handler);
    // start rotation tweens
    if (dice1Ref.current && dice2Ref.current) {
      diceTweensRef.current.t1 = gsap.to(dice1Ref.current, { rotation: '+=6.283', duration: 0.4, repeat: -1, ease: 'none' });
      diceTweensRef.current.t2 = gsap.to(dice2Ref.current, { rotation: '+=6.283', duration: 0.45, repeat: -1, ease: 'none' });
    }
  };

  const stopDiceSpin = () => {
    if (tickerHandlerRef.current) {
      gsap.ticker.remove(tickerHandlerRef.current);
      tickerHandlerRef.current = null;
    }
    setIsSpinningDice(false);
    // stop rotation tweens
    if (diceTweensRef.current.t1) {
      diceTweensRef.current.t1.kill();
      diceTweensRef.current.t1 = null;
    }
    if (diceTweensRef.current.t2) {
      diceTweensRef.current.t2.kill();
      diceTweensRef.current.t2 = null;
    }
  };

  const animatePawnSteps = async (steps: number) => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      for (let i = 1; i <= steps; i += 1) {
        tl.to({}, {
          duration: 0.12,
          onComplete: () => setCurrentIndex((prev) => (prev + 1) % 16),
          ease: 'power1.inOut',
        });
      }
    });
  };

  const handleRollClick = async () => {
    if (isRolling || !game.availableToSpin) return;
    setIsRolling(true);

    // show -50 immediately
    setBalanceDelta({ value: -50, color: '#ff6b6b' });

    startDiceSpin();
    // trigger backend/mock roll
    game.roll();

    // wait 1s for spin animation (regardless of network)
    await new Promise((r) => setTimeout(r, 1000));

    stopDiceSpin();

    // use the latest dice result from controller
    const dice = game.dice;
    if (dice) setDisplayDice(dice);

    // animate pawn movement based on dice
    const steps = dice ? dice[0] + dice[1] : 0;
    if (steps > 0) await animatePawnSteps(steps);

    // show +win after move
    if (typeof game.lastPrize === 'number' && game.lastPrize > 0) {
      setBalanceDelta({ value: game.lastPrize, color: '#00e676' });
      // clear delta after a moment
      setTimeout(() => setBalanceDelta(null), 1200);
    } else {
      setTimeout(() => setBalanceDelta(null), 800);
    }

    setIsRolling(false);
  };

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

  const handleResetClick = () => {
    // On backend mode, start from first square
    if (!game.isMockMode) {
      setCurrentIndex(0);
      justResetRef.current = true;
    }
    game.reset();
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
        text={`Balance: ${game.balance}`}
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
        onPointerDown={handleRollClick}
        cursor='pointer'
      />

      <pixiText
        text={"Roll dice"}
        x={160}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {/* Balance delta */}
      {balanceDelta && (
        <pixiText
          text={`${balanceDelta.value > 0 ? '+' : ''}${balanceDelta.value}`}
          x={250}
          y={80}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: 20,
            fill: balanceDelta.color,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Dice display */}
      {diceTextures && displayDice && (
        <>
          <pixiSprite
            ref={dice1Ref}
            texture={diceTextureFor(displayDice[0])!}
            x={200}
            y={460}
            anchor={{ x: 0.5, y: 0.5 }}
            width={56}
            height={56}
          />
          <pixiSprite
            ref={dice2Ref}
            texture={diceTextureFor(displayDice[1])!}
            x={280}
            y={460}
            anchor={{ x: 0.5, y: 0.5 }}
            width={56}
            height={56}
          />
        </>
      )}

      <pixiGraphics
        x={240}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0xe74c3c);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={handleResetClick}
        cursor='pointer'
      />
      <pixiText
        text={"Reset"}
        x={300}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />


      <pixiText
        text={`Board Mode: ${game.isMockMode ? 'Mock (Local)' : 'Backend'}`}
        x={300}
        y={170}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 14,
          fill: game.isMockMode ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />

      {/* Selected Cell Display */}
      {game.board && (
        <pixiText
          text={`Selected: ${game.board[currentIndex]}`}
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

      {game.board && (
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
                {game.board.map((cell, index) => {
                  const { row, col } = positions[index];
                  const x = startX + col * total;
                  const y = startY + row * total;
                  const isBonus = cell === 'bonus';
                  const isSelected = index === currentIndex;
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

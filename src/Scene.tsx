import { useEffect, useRef, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { gsap } from 'gsap';
import { useGameController } from './hooks/useGameController';
import { useNavigate, useSearchParams } from 'react-router';

function Scene() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isSpinningDice, setIsSpinningDice] = useState<boolean>(false);
  const [displayDice, setDisplayDice] = useState<[number, number] | null>(null);
  const [diceTextures, setDiceTextures] = useState<Record<number, Texture> | null>(null);
  const tickerHandlerRef = useRef<((time: number) => void) | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<{ value: number; color: string } | null>(null);
  const dice1Ref = useRef<any>(null);
  const dice2Ref = useRef<any>(null);
  const diceTweensRef = useRef<{ t1: gsap.core.Tween | null; t2: gsap.core.Tween | null }>({ t1: null, t2: null });
  const justResetRef = useRef<boolean>(false);

  const game = useGameController();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [showModePopup, setShowModePopup] = useState<boolean>(false);
  const [pendingTargetMock, setPendingTargetMock] = useState<boolean | null>(null);

  useEffect(() => {
    if (!game.board) return;
    const value = game.board[currentIndex];
    console.log('Selected board cell:', value);
  }, [game.board, currentIndex]);

  // Add refresh warning for mock mode
  useEffect(() => {
    if (!game.isMockMode) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You will lose your mock game state if you refresh. Are you sure you want to continue?';
      return 'You will lose your mock game state if you refresh. Are you sure you want to continue?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [game.isMockMode]);

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

  const handleResetClick = () => {
    // On backend mode, start from first square
    if (!game.isMockMode) {
      setCurrentIndex(0);
      justResetRef.current = true;
    }
    game.reset();
  };

  const openModePopup = (targetMock: boolean) => {
    setPendingTargetMock(targetMock);
    setShowModePopup(true);
  };

  const applyModeSwitch = () => {
    if (pendingTargetMock === null) return;
    
    // Reset mock state when switching from mock to backend
    if (game.isMockMode && !pendingTargetMock) {
      game.reset();
    }
    
    // Reset pawn position to first square when switching from backend to mock
    if (!game.isMockMode && pendingTargetMock) {
      setCurrentIndex(0);
    }
    
    const p = new URLSearchParams(params);
    if (pendingTargetMock) p.set('mock', 'true');
    else p.delete('mock');
    navigate({ pathname: '/', search: `?${p.toString()}` });
    setShowModePopup(false);
    setPendingTargetMock(null);
  };

  const cancelModeSwitch = () => {
    setShowModePopup(false);
    setPendingTargetMock(null);
  };

  return (
    <pixiContainer x={0} y={0}>
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
        text={`Board Mode: ${game.isMockMode ? 'Mock' : 'Real'}`}
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
          text={`Current Square: ${game.board[currentIndex]}`}
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

      {/* Floating mode switch button (bottom-right) */}
      <pixiGraphics
        x={window.innerWidth - 80}
        y={window.innerHeight - 80}
        draw={(g) => {
          g.clear();
          g.fill(0x2c3e50, 0.9);
          g.circle(0, 0, 28);
          g.fill();
          g.stroke({ color: 0xecf0f1, width: 2 });
          g.circle(0, 0, 28);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={() => openModePopup(!game.isMockMode)}
        cursor='pointer'
      />
      <pixiText
        text={game.isMockMode ? 'Mock' : 'Live'}
        x={window.innerWidth - 80}
        y={window.innerHeight - 80}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{ fontSize: 12, fill: '#ecf0f1', fontFamily: 'Arial', fontWeight: 'bold' }}
      />

      {/* Mode popup */}
      {showModePopup && (
        <>
          {/* overlay */}
          <pixiGraphics
            x={0}
            y={0}
            draw={(g) => {
              g.clear();
              g.fill(0x000000, 0.5);
              g.rect(0, 0, window.innerWidth, window.innerHeight);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={cancelModeSwitch}
          />
          {/* dialog */}
          <pixiGraphics
            x={window.innerWidth / 2 - 180}
            y={window.innerHeight / 2 - 100}
            draw={(g) => {
              g.clear();
              g.fill(0x34495e, 0.95);
              g.roundRect(0, 0, 360, 180, 12);
              g.fill();
              g.stroke({ color: 0xffffff, width: 2 });
              g.roundRect(0, 0, 360, 180, 12);
              g.stroke();
            }}
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock mode?' : 'Switch to Live mode?'}
            x={window.innerWidth / 2}
            y={window.innerHeight / 2 - 60}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 18, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
          {!pendingTargetMock && (
            <pixiText
              text={'Warning: switching from Mock will lose local game state.'}
              x={window.innerWidth / 2}
              y={window.innerHeight / 2 - 25}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{ fontSize: 14, fill: '#ffcc00', fontFamily: 'Arial' }}
            />
          )}
          {/* buttons */}
          <pixiGraphics
            x={window.innerWidth / 2 - 120}
            y={window.innerHeight / 2 + 20}
            draw={(g) => {
              g.clear();
              g.fill(0x27ae60);
              g.roundRect(0, 0, 120, 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={applyModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={pendingTargetMock ? 'Switch to Mock' : 'Switch to Live'}
            x={window.innerWidth / 2 - 60}
            y={window.innerHeight / 2 + 40}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 16, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
          <pixiGraphics
            x={window.innerWidth / 2 + 0}
            y={window.innerHeight / 2 + 20}
            draw={(g) => {
              g.clear();
              g.fill(0xc0392b);
              g.roundRect(0, 0, 120, 40, 8);
              g.fill();
            }}
            eventMode='static'
            onPointerDown={cancelModeSwitch}
            cursor='pointer'
          />
          <pixiText
            text={'Cancel'}
            x={window.innerWidth / 2 + 60}
            y={window.innerHeight / 2 + 40}
            anchor={{ x: 0.5, y: 0.5 }}
            style={{ fontSize: 16, fill: '#ffffff', fontFamily: 'Arial', fontWeight: 'bold' }}
          />
        </>
      )}

    </pixiContainer>
  );
}

export default Scene;

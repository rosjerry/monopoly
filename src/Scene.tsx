import { useEffect, useRef, useState, useCallback } from 'react';
import { Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { useGameController } from './hooks/useGameController';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  BalanceDisplay, 
  ControlButtons, 
  DiceDisplay, 
  GameBoard, 
  GameInfo, 
  ModeSwitcher 
} from './components';

function Scene() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isSpinningDice, setIsSpinningDice] = useState<boolean>(false);
  const [displayDice, setDisplayDice] = useState<[number, number] | null>(null);
  const [diceTextures, setDiceTextures] = useState<Record<number, Texture> | null>(null);
  const tickerHandlerRef = useRef<((time: number) => void) | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<{ value: number; color: string } | null>(null);
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

  useEffect(() => {
    if (justResetRef.current) return; // skip if we just reset
    if (!game.board || game.lastPrize == null || isRolling) return;
    const idx = game.board.findIndex((cell) => typeof cell === 'number' && cell === game.lastPrize);
    if (idx >= 0) setCurrentIndex(idx);
  }, [game.board, game.lastPrize, isRolling]);

  useEffect(() => {
    if (!game.board) return;
    if (justResetRef.current) {
      setCurrentIndex(0);
      justResetRef.current = false;
    }
  }, [game.board]);

  const handleDiceTexturesLoaded = useCallback((textures: Record<number, Texture>) => {
    setDiceTextures(textures);
    if (game.dice) setDisplayDice(game.dice);
  }, [game.dice]);

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
  };

  const stopDiceSpin = () => {
    if (tickerHandlerRef.current) {
      gsap.ticker.remove(tickerHandlerRef.current);
      tickerHandlerRef.current = null;
    }
    setIsSpinningDice(false);
  };

  const handleRollClick = async () => {
    if (isRolling || !game.availableToSpin) return;
    setIsRolling(true);

    setBalanceDelta({ value: -50, color: '#ff6b6b' });

    startDiceSpin();
    game.roll();

    await new Promise((r) => setTimeout(r, 1000));

    stopDiceSpin();

    const dice = game.dice;
    if (dice) setDisplayDice(dice);

    if (typeof game.lastPrize === 'number' && game.lastPrize > 0) {
      setBalanceDelta({ value: game.lastPrize, color: '#00e676' });
      setTimeout(() => setBalanceDelta(null), 1200);
    } else {
      setTimeout(() => setBalanceDelta(null), 800);
    }

    setIsRolling(false);
  };

  const handleResetClick = () => {
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
    
    if (game.isMockMode && !pendingTargetMock) {
      game.reset();
    }
    
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
      <BalanceDisplay 
        balance={game.balance} 
        balanceDelta={balanceDelta} 
      />
      
      <ControlButtons
        onRollClick={handleRollClick}
        onResetClick={handleResetClick}
        isRolling={isRolling}
        availableToSpin={game.availableToSpin}
      />
      
      <DiceDisplay
        displayDice={displayDice}
        isSpinning={isSpinningDice}
        onDiceTexturesLoaded={handleDiceTexturesLoaded}
      />
      
      <GameInfo
        board={game.board}
        currentIndex={currentIndex}
        isMockMode={game.isMockMode}
      />
      
      <GameBoard
        board={game.board}
        currentIndex={currentIndex}
      />
      
      <ModeSwitcher
        isMockMode={game.isMockMode}
        showModePopup={showModePopup}
        pendingTargetMock={pendingTargetMock}
        onOpenModePopup={openModePopup}
        onApplyModeSwitch={applyModeSwitch}
        onCancelModeSwitch={cancelModeSwitch}
      />
    </pixiContainer>
  );
}

export default Scene;

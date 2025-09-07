import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';

interface DiceState {
  dice: [number, number] | null;
  isRolling: boolean;
}

interface UseDiceStateReturn {
  diceState: DiceState;
  rollDice: () => Promise<void>;
  isMockMode: boolean;
}

export const useDiceState = (): UseDiceStateReturn => {
  const [searchParams] = useSearchParams();
  const isMockMode = searchParams.get('mock') === 'true';
  
  const [diceState, setDiceState] = useState<DiceState>({
    dice: null,
    isRolling: false,
  });

  const rollDiceMock = useCallback((): [number, number] => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return [dice1, dice2];
  }, []);

  const rollDiceBackend = useCallback(async (): Promise<[number, number]> => {
    try {
      const response = await fetch('http://localhost:3000/dice');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const diceResult = await response.json();
      
      if (!Array.isArray(diceResult) || diceResult.length !== 2) {
        throw new Error('Invalid dice response format');
      }
      
      return [diceResult[0], diceResult[1]];
    } catch (error) {
      console.error('Failed to roll dice from backend:', error);
      return rollDiceMock();
    }
  }, [rollDiceMock]);

  const rollDice = useCallback(async (): Promise<void> => {
    setDiceState(prev => ({ ...prev, isRolling: true }));
    
    try {
      const diceResult = isMockMode ? rollDiceMock() : await rollDiceBackend();
      
      setDiceState(prev => ({
        ...prev,
        dice: diceResult,
        isRolling: false,
      }));
    } catch (error) {
      console.error('Error rolling dice:', error);
      setDiceState(prev => ({
        ...prev,
        isRolling: false,
      }));
    }
  }, [isMockMode, rollDiceMock, rollDiceBackend]);

  return {
    diceState,
    rollDice,
    isMockMode,
  };
};

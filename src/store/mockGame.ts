import { create } from 'zustand';
import type { BoardCell, GameStateResponse } from '../api/types';
import { 
  GAME_CONSTANTS, 
  generateBoardNumbers, 
  canAffordRoll, 
  calculateNewBalance 
} from '../constants';

function createInitialBoard(): BoardCell[] {
  const numbers = generateBoardNumbers();
  
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  
  const insertIndex = Math.floor(Math.random() * GAME_CONSTANTS.BOARD_SIZE);
  
  const result: BoardCell[] = [];
  let numberIndex = 0;
  
  for (let i = 0; i < GAME_CONSTANTS.BOARD_SIZE; i += 1) {
    if (i === insertIndex) {
      result.push('bonus');
    } else {
      result.push(shuffled[numberIndex]);
      numberIndex += 1;
    }
  }
  
  const numbersOnly = result.filter((cell): cell is number => typeof cell === 'number');
  const uniqueNumbers = new Set(numbersOnly);
  if (uniqueNumbers.size !== numbersOnly.length) {
    console.error('Board generation created duplicates:', numbersOnly);
    return createInitialBoard();
  }
  
  console.log('Generated board:', result);
  return result;
}

type MockGameState = GameStateResponse & {
  roll: () => void;
  reset: () => void;
  currentIndex: number;
};

const initialRegular = createInitialBoard();

export const useMockGameStore = create<MockGameState>((set, get) => ({
  balance: GAME_CONSTANTS.INITIAL_BALANCE,
  dice_result: null,
  last_prize_won: null,
  available_to_spin: true,
  bonus_mode_board: null,
  bonus_mode: false,
  freespin_amount: 0,
  regular_mode_board: initialRegular,
  currentIndex: 0,
  roll: () => {
    const state = get();
    if (!state.bonus_mode && !canAffordRoll(state.balance)) {
      set({ available_to_spin: false });
      return;
    }

    const d1 = Math.floor(Math.random() * GAME_CONSTANTS.DICE_MAX_VALUE) + GAME_CONSTANTS.DICE_MIN_VALUE;
    const d2 = Math.floor(Math.random() * GAME_CONSTANTS.DICE_MAX_VALUE) + GAME_CONSTANTS.DICE_MIN_VALUE;
    const sum = d1 + d2;

    const board = state.bonus_mode && state.bonus_mode_board
      ? state.bonus_mode_board
      : state.regular_mode_board;

    const targetIndex = (state.currentIndex + sum) % board.length;
    const prize = board[targetIndex];

    if (prize === 'bonus' && !state.bonus_mode) {
      const multiplied = state.regular_mode_board.map((v) => {
        if (v === 'bonus') {
          return GAME_CONSTANTS.BONUS_MODE_PRIZE;
        } else if (typeof v === 'number') {
          return v * GAME_CONSTANTS.BONUS_MODE_MULTIPLIER;
        } else {
          console.warn('Unexpected board cell value:', v);
          return 0;
        }
      }) as BoardCell[];
      
      console.log('Entering bonus mode - Original board:', state.regular_mode_board);
      console.log('Entering bonus mode - Bonus board:', multiplied);
      
      set({
        dice_result: [d1, d2],
        last_prize_won: 0,
        available_to_spin: true,
        bonus_mode: true,
        freespin_amount: GAME_CONSTANTS.BONUS_MODE_FREE_SPINS,
        bonus_mode_board: multiplied,
        currentIndex: state.currentIndex,
      });
      return;
    }

    if (state.bonus_mode) {
      const won = typeof prize === 'number' ? prize : 0;
      const newFree = Math.max(0, state.freespin_amount - 1);
      const exitBonus = newFree === 0;
      set({
        dice_result: [d1, d2],
        last_prize_won: won,
        balance: state.balance + won,
        freespin_amount: newFree,
        bonus_mode: exitBonus ? false : true,
        bonus_mode_board: exitBonus ? null : state.bonus_mode_board,
        regular_mode_board: exitBonus ? createInitialBoard() : state.regular_mode_board,
        currentIndex: targetIndex,
      });
      return;
    }

    const won = typeof prize === 'number' ? prize : 0;
    const newBalance = calculateNewBalance(state.balance, won);
    set({
      dice_result: [d1, d2],
      last_prize_won: won,
      balance: newBalance,
      available_to_spin: canAffordRoll(newBalance),
      currentIndex: targetIndex,
    });
  },
  reset: () => {
    set({
      balance: GAME_CONSTANTS.INITIAL_BALANCE,
      dice_result: null,
      last_prize_won: null,
      available_to_spin: true,
      bonus_mode_board: null,
      bonus_mode: false,
      freespin_amount: 0,
      regular_mode_board: createInitialBoard(),
      currentIndex: 0,
    });
  },
}));




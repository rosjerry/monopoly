import { create } from 'zustand';
import type { BoardCell, GameStateResponse } from '../api/types';

function createInitialBoard(): BoardCell[] {
  // Create 15 unique numbers from 5 to 75 (in steps of 5)
  const numbers: number[] = Array.from({ length: 15 }, (_, i) => (i + 1) * 5);
  
  // Shuffle the numbers array
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  
  // Choose a random position for the bonus square
  const insertIndex = Math.floor(Math.random() * 16);
  
  // Create the result array
  const result: BoardCell[] = [];
  let numberIndex = 0;
  
  for (let i = 0; i < 16; i += 1) {
    if (i === insertIndex) {
      result.push('bonus');
    } else {
      result.push(shuffled[numberIndex]);
      numberIndex += 1;
    }
  }
  
  // Verify no duplicates (excluding bonus)
  const numbersOnly = result.filter((cell): cell is number => typeof cell === 'number');
  const uniqueNumbers = new Set(numbersOnly);
  if (uniqueNumbers.size !== numbersOnly.length) {
    console.error('Board generation created duplicates:', numbersOnly);
    // Regenerate if duplicates found
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
  balance: 100,
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
    if (!state.bonus_mode && state.balance < 50) {
      set({ available_to_spin: false });
      return;
    }

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;

    const board = state.bonus_mode && state.bonus_mode_board
      ? state.bonus_mode_board
      : state.regular_mode_board;

    // advance exactly sum steps from currentIndex
    const targetIndex = (state.currentIndex + sum) % board.length;
    const prize = board[targetIndex];

    if (prize === 'bonus' && !state.bonus_mode) {
      const multiplied = state.regular_mode_board.map((v) => {
        if (v === 'bonus') {
          return 500;
        } else if (typeof v === 'number') {
          return v * 10;
        } else {
          // Fallback for any unexpected values
          console.warn('Unexpected board cell value:', v);
          return 0;
        }
      }) as BoardCell[];
      
      console.log('Entering bonus mode - Original board:', state.regular_mode_board);
      console.log('Entering bonus mode - Bonus board:', multiplied);
      
      set({
        dice_result: [d1, d2],
        last_prize_won: 0,
        balance: state.balance, // cost applied only after bonus spins? per spec cost still applied on the spin that hits bonus
        available_to_spin: true,
        bonus_mode: true,
        freespin_amount: 3,
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
        // Regenerate regular board when exiting bonus mode to prevent duplicates
        regular_mode_board: exitBonus ? createInitialBoard() : state.regular_mode_board,
        currentIndex: targetIndex,
      });
      return;
    }

    // regular mode
    const cost = 50;
    const won = typeof prize === 'number' ? prize : 0;
    const newBalance = state.balance - cost + won;
    set({
      dice_result: [d1, d2],
      last_prize_won: won,
      balance: newBalance,
      available_to_spin: newBalance > 50,
      currentIndex: targetIndex,
    });
  },
  reset: () => {
    set({
      balance: 100,
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




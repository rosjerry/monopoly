import { create } from 'zustand';
import type { BoardCell, GameStateResponse } from '../api/types';

function createInitialBoard(): BoardCell[] {
  const numbers: number[] = Array.from({ length: 15 }, (_, i) => (i + 1) * 5);
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  const insertIndex = Math.floor(Math.random() * 16);
  const result: BoardCell[] = [];
  let idx = 0;
  for (let i = 0; i < 16; i += 1) {
    if (i === insertIndex) result.push('bonus');
    else {
      result.push(shuffled[idx]);
      idx += 1;
    }
  }
  return result;
}

type MockGameState = GameStateResponse & {
  roll: () => void;
  reset: () => void;
};

const initialRegular = createInitialBoard();

export const useMockGameStore = create<MockGameState>((set, get) => ({
  balance: 500,
  dice_result: null,
  last_prize_won: null,
  available_to_spin: true,
  bonus_mode_board: null,
  bonus_mode: false,
  freespin_amount: 0,
  regular_mode_board: initialRegular,
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

    // position moves clockwise by sum; we just sample prize at index sum-1 for simplicity
    const idx = (sum - 1) % board.length;
    const prize = board[idx];

    if (prize === 'bonus' && !state.bonus_mode) {
      const multiplied = state.regular_mode_board.map((v) => (v === 'bonus' ? 500 : (v as number) * 10)) as BoardCell[];
      set({
        dice_result: [d1, d2],
        last_prize_won: 0,
        balance: state.balance, // cost applied only after bonus spins? per spec cost still applied on the spin that hits bonus
        available_to_spin: true,
        bonus_mode: true,
        freespin_amount: 3,
        bonus_mode_board: multiplied,
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
    });
  },
  reset: () => {
    set({
      balance: 500,
      dice_result: null,
      last_prize_won: null,
      available_to_spin: true,
      bonus_mode_board: null,
      bonus_mode: false,
      freespin_amount: 0,
      regular_mode_board: createInitialBoard(),
    });
  },
}));



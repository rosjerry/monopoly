export type BoardCell = number | 'bonus';

export interface GameStateResponse {
  balance: number;
  dice_result: [number, number] | null;
  last_prize_won: number | null;
  available_to_spin: boolean;
  bonus_mode_board: BoardCell[] | null;
  bonus_mode: boolean;
  freespin_amount: number;
  regular_mode_board: BoardCell[];
}

export const getActiveBoard = (state: GameStateResponse): BoardCell[] => {
  return state.bonus_mode && state.bonus_mode_board
    ? state.bonus_mode_board
    : state.regular_mode_board;
};

export interface RollResponse {
  dice_result: [number, number];
}



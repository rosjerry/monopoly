export const GAME_CONSTANTS = {
  INITIAL_BALANCE: 100,
  ROLL_COST: 50,
  BOARD_SIZE: 16,
  BOARD_NUMBERS_COUNT: 15,
  BOARD_NUMBER_MULTIPLIER: 5,
  BONUS_MODE_PRIZE: 500,
  BONUS_MODE_MULTIPLIER: 10,
  BONUS_MODE_FREE_SPINS: 3,
  DICE_MIN_VALUE: 1,
  DICE_MAX_VALUE: 6,
  DICE_COUNT: 2,
} as const;

export const generateBoardNumbers = (): number[] => {
  return Array.from(
    { length: GAME_CONSTANTS.BOARD_NUMBERS_COUNT }, 
    (_, i) => (i + 1) * GAME_CONSTANTS.BOARD_NUMBER_MULTIPLIER
  );
};

export const canAffordRoll = (balance: number): boolean => {
  return balance >= GAME_CONSTANTS.ROLL_COST;
};

export const calculateNewBalance = (currentBalance: number, prize: number): number => {
  return currentBalance - GAME_CONSTANTS.ROLL_COST + prize;
};

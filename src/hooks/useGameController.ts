import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useGameStateQuery, useResetGameMutation, useSpinMutation } from '../api/hooks';
import { getActiveBoard } from '../api/types';
import { useMockGameStore } from '../store/mockGame';

export function useGameController() {
  const [params] = useSearchParams();
  const isMock = params.get('mock') === 'true';

  const gameQuery = useGameStateQuery();
  const spinMutation = useSpinMutation();
  const resetMutation = useResetGameMutation();

  const mockStore = useMockGameStore();

  return useMemo(() => {
    if (isMock) {
      const board = mockStore.bonus_mode && mockStore.bonus_mode_board
        ? mockStore.bonus_mode_board
        : mockStore.regular_mode_board;
      return {
        isMockMode: true,
        isLoading: false,
        balance: mockStore.balance,
        dice: mockStore.dice_result,
        lastPrize: mockStore.last_prize_won,
        availableToSpin: mockStore.available_to_spin,
        board,
        bonusMode: mockStore.bonus_mode,
        freespins: mockStore.freespin_amount,
        roll: () => mockStore.roll(),
        reset: () => mockStore.reset(),
      } as const;
    }
    const data = gameQuery.data;
    return {
      isMockMode: false,
      isLoading: gameQuery.isLoading || spinMutation.isPending || resetMutation.isPending,
      balance: data?.balance ?? 0,
      dice: data?.dice_result ?? null,
      lastPrize: data?.last_prize_won ?? null,
      availableToSpin: data?.available_to_spin ?? false,
      board: data ? getActiveBoard(data) : null,
      bonusMode: !!data?.bonus_mode,
      freespins: data?.freespin_amount ?? 0,
      roll: () => spinMutation.mutate(),
      reset: () => resetMutation.mutate(),
      error: gameQuery.error || spinMutation.error || resetMutation.error || null,
    } as const;
  }, [isMock, gameQuery.data, gameQuery.isLoading, spinMutation.isPending, resetMutation.isPending, mockStore]);
}



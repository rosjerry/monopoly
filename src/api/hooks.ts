import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMakeBet, postResetGame, postRoll } from './client';
import type { GameStateResponse } from './types';

export const queryKeys = {
  game: ['game'] as const,
};

export function useGameStateQuery() {
  return useQuery<GameStateResponse>({
    queryKey: queryKeys.game,
    queryFn: getMakeBet,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useSpinMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postRoll,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.game });
    }
  });
}

export function useResetGameMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postResetGame,
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.game, data);
    },
  });
}



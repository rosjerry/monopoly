import type { GameStateResponse, RollResponse } from './types';

const API_BASE = 'http://localhost:3002';

export async function getMakeBet(): Promise<GameStateResponse> {
  const res = await fetch(`${API_BASE}/makebet`, { method: 'GET' });
  if (!res.ok) throw new Error(`makebet failed: ${res.status}`);
  return res.json();
}

export async function postResetGame(): Promise<GameStateResponse> {
  const res = await fetch(`${API_BASE}/reset-game`, { method: 'POST' });
  if (!res.ok) throw new Error(`reset-game failed: ${res.status}`);
  return res.json();
}

export async function postRoll(): Promise<RollResponse> {
  const res = await fetch(`${API_BASE}/roll`, { method: 'POST' });
  if (!res.ok) throw new Error(`roll failed: ${res.status}`);
  return res.json();
}



import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

export type BoardCell = number | 'bonus';

interface BoardState {
	board: BoardCell[] | null;
	isLoading: boolean;
}

interface UseBoardStateReturn {
	boardState: BoardState;
	generateBoard: () => Promise<void>;
	isMockMode: boolean;
}

function shuffleArray<T>(input: T[]): T[] {
	const arr = [...input];
	for (let i = arr.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function createMockBoard(): BoardCell[] {
	const numbers: number[] = Array.from({ length: 15 }, (_, idx) => (idx + 1) * 5);
	const shuffledNumbers = shuffleArray(numbers);
	// Insert "bonus" at a random position among 16 cells
	const insertIndex = Math.floor(Math.random() * 16);
	const board: BoardCell[] = [];
	let numIdx = 0;
	for (let i = 0; i < 16; i += 1) {
		if (i === insertIndex) {
			board.push('bonus');
		} else {
			board.push(shuffledNumbers[numIdx]);
			numIdx += 1;
		}
	}
	return board;
}

export const useBoardState = (): UseBoardStateReturn => {
	const [searchParams] = useSearchParams();
	const isMockMode = searchParams.get('mock') === 'true';

	const [boardState, setBoardState] = useState<BoardState>({ board: null, isLoading: false });

	const validateBoard = useCallback((data: unknown): data is BoardCell[] => {
		if (!Array.isArray(data) || data.length !== 16) return false;
		let bonusCount = 0;
		for (const cell of data) {
			if (cell === 'bonus') {
				bonusCount += 1;
				continue;
			}
			if (typeof cell !== 'number') return false;
			if (cell % 5 !== 0) return false;
			if (cell < 5 || cell > 75) return false;
		}
		return bonusCount === 1;
	}, []);

	const fetchBoardFromBackend = useCallback(async (): Promise<BoardCell[]> => {
		const response = await fetch('http://localhost:3002/board');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (!validateBoard(data)) {
			throw new Error('Invalid board response format');
		}
		return data;
	}, [validateBoard]);

	const generateBoard = useCallback(async () => {
		setBoardState(prev => ({ ...prev, isLoading: true }));
		try {
			const board = isMockMode ? createMockBoard() : await fetchBoardFromBackend();
			setBoardState({ board, isLoading: false });
		} catch (error) {
			console.error('Failed to generate board, falling back to mock:', error);
			const fallback = createMockBoard();
			setBoardState({ board: fallback, isLoading: false });
		}
	}, [isMockMode, fetchBoardFromBackend]);

	return { boardState, generateBoard, isMockMode };
};

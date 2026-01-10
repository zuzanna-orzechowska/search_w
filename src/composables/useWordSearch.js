import { ref } from 'vue';

export function useWordSearch(gridSize = 12) {
    const grid = ref([]);
    const selection = ref([]);
    const isSelecting = ref(false);
    const startCell = ref(null);
    const selectionColor = ref(null);
    const wordsColor = ref({});
    const foundWordsData = ref([]);
    const allWordsData = ref([]);

    const generateGrid = (wordsToFind) => {
        let allWordsPlaced = false;
        while (!allWordsPlaced) {
            const temp = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
            const directions = [
                { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
                { x: 1, y: 1 }, { x: -1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: -1 }
            ];
            const sortedWords = [...wordsToFind].sort((a, b) => b.length - a.length);
            let success = true;

            for (const word of sortedWords) {
                if (!placeWord(word.toUpperCase(), temp, directions)) {
                    success = false;
                    break;
                }
            }

            if (success) {
                fillRandomLetters(temp);
                grid.value = temp;
                allWordsPlaced = true;
            }
        }
    };

    const placeWord = (word, tempGrid, directions) => {
        const positions = [];
        directions.forEach(direction => {
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    positions.push({ x, y, direction });
                }
            }
        });
        positions.sort(() => Math.random() - 0.5);

        for (const p of positions) {
            if (doesWordFits(word, p.x, p.y, p.direction, tempGrid)) {
                const coords = [];
                for (let i = 0; i < word.length; i++) {
                    const xx = p.x + (p.direction.x * i);
                    const yy = p.y + (p.direction.y * i);
                    tempGrid[yy][xx] = word[i];
                    coords.push({ row: yy, col: xx });
                }
                allWordsData.value.push({ word, coords });
                return true;
            }
        }
        return false;
    };

    const doesWordFits = (word, startX, startY, direction, tempGrid) => {
        const endX = startX + direction.x * (word.length - 1);
        const endY = startY + direction.y * (word.length - 1);
        if (endX >= gridSize || endY >= gridSize || endX < 0 || endY < 0) return false;

        for (let i = 0; i < word.length; i++) {
            const x = startX + direction.x * i;
            const y = startY + direction.y * i;
            if (tempGrid[y][x] !== '' && tempGrid[y][x] !== word[i]) return false;
        }
        return true;
    };

    const fillRandomLetters = (tempGrid) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (tempGrid[j][i] === '') tempGrid[j][i] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    };

    return {
        grid, selection, isSelecting, startCell, selectionColor,
        wordsColor, foundWordsData, allWordsData, generateGrid
    };
}
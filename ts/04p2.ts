import { promises as fs } from 'fs';

class Board {
  private checks: boolean[][];
  private alreadyWinner: boolean = false;

  constructor(public readonly values: number[][]) {
    this.checks = [...Array(5)].map(() => [false, false, false, false, false]);
  }

  draw(value: number): void {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (this.values[y][x] === value) {
          this.checks[y][x] = true;
          return;
        }
      }
    }
  }

  get isWinner(): boolean {
    if (this.alreadyWinner) {
      return true;
    }
    for (let a = 0; a < 5; a++) {
      let rowMatch = true;
      let columnMatch = true;
      for (let b = 0; b < 5; b++) {
        rowMatch &&= this.checks[a][b];
        columnMatch &&= this.checks[b][a];
      }
      if (rowMatch || columnMatch) {
        this.alreadyWinner = true;
        return true;
      }
    }
    return false;
  }

  calculateScore(winnerDraw: number) {
    let sumOfUnmarked: number = 0;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (!this.checks[y][x]) {
          sumOfUnmarked += this.values[y][x];
        }
      }
    }
    return winnerDraw * sumOfUnmarked;
  }
}

function parseBoards(input: string[]): Board[] {
  const boards: Board[] = [];
  const count = Math.ceil(input.length / 6);

  for (let i = 0; i < count; i++) {
    const values = input.slice(i * 6, i * 6 + 5).map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((v) => +v)
    );
    boards.push(new Board(values));
  }

  return boards;
}

function game(
  boards: Board[],
  draws: number[],
  rank: number
): [Board, number] | undefined {
  const winners = new Set<Board>();
  for (const draw of draws) {
    for (const board of boards) {
      board.draw(draw);
      if (board.isWinner) {
        winners.add(board);
        if (winners.size === rank) {
          return [board, draw];
        }
      }
    }
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/04.txt')).toString();
  const lines = input.split('\n');
  const draws = lines[0].split(',').map((v) => +v);
  const boards = parseBoards(lines.slice(2));
  const [winningBoard, winningDraw] = game(boards, draws, boards.length) || [];
  if (winningBoard && winningDraw !== undefined) {
    console.log(winningBoard.calculateScore(winningDraw));
  }
})();

import { promises as fs } from 'fs';

const days: number = Number(process.argv.pop() ?? '0');

(async () => {
  const input = (await fs.readFile('../inputs/06.txt')).toString();
  const initialState: number[] = input.split(',').map((v) => +v);

  const state = [...Array(9)].map(() => 0);

  for (const v of initialState) {
    state[v]++;
  }
  // console.log('initial     ', '|||', 0, '|||', [...state.values()].join(', '));

  let carry = 0;
  for (let day = 1; day <= days; day++) {
    state[0] = 0;
    for (let i = 1; i <= 8; i++) {
      state[i - 1] += state[i];
      state[i] = 0;
    }
    state[6] += carry;
    state[8] += carry;
    carry = state[0];
    // console.log(
    //   'after day',
    //   String(day).padStart(2, ' '),
    //   '|||',
    //   carry,
    //   '|||',
    //   [...state.values()].join(', ')
    // );
  }
  let size = 0;
  for (let i = 0; i <= 8; i++) {
    size += state[i];
  }
  console.log(size);
})();

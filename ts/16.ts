import { promises as fs } from 'fs';

const debug = false;

let versionSum = 0;

/**
 * @returns value and bits the operation consumed
 */
function parseValueInPacket(bits: string, start: number): [number, number] {
  const valueBits: string[] = [];
  let wasLastGroup = false;
  let groups = 0;
  for (let i = start; !wasLastGroup; i += 5) {
    groups++;
    if (bits[i] === '0') {
      wasLastGroup = true;
    }
    const part = bits.slice(i + 1, i + 5);
    debug && console.log('Bits part', `${i + 1}-${i + 4}`, part);
    valueBits.push(part);
  }
  const value = parseInt(valueBits.join(''), 2);
  return [value, groups * 5 + 6];
}

/**
 * @returns bits consumed
 */
function parsePacket(bits: string, start: number): number {
  debug && console.log('Reading from', start);
  const version = parseInt(bits.slice(start + 0, start + 3), 2);
  versionSum += version;
  debug && console.log('Version', version);
  const typeId = parseInt(bits.slice(start + 3, start + 6), 2);
  debug && console.log('Type ID', typeId);
  if (typeId === 4) {
    debug && console.log('Packet is a single value container');
    const [value, bitsConsumed] = parseValueInPacket(bits, start + 6);
    debug && console.log('Value', value);
    debug && console.log('Bits consumed', bitsConsumed);
    return bitsConsumed;
  } else {
    debug && console.log('Packet is an operator with subpackets');
    const lengthTypeId = bits[start + 6];
    if (lengthTypeId === '0') {
      const totalLength = parseInt(bits.slice(start + 7, start + 7 + 15), 2);
      debug && console.log('Total length of subpackets', totalLength);
      for (
        let i = 0;
        i < totalLength;
        i += parsePacket(bits, start + 7 + 15 + i)
      );
      debug && console.log('Bits consumed by operator', totalLength + 22);
      return totalLength + 22;
    } else if (lengthTypeId === '1') {
      const totalCount = parseInt(bits.slice(start + 7, start + 7 + 11), 2);
      debug && console.log('Total count of subpackets', totalCount);
      let bitsConsumed = 0;
      for (let i = 0; i < totalCount; i++) {
        bitsConsumed += parsePacket(bits, start + 7 + 11 + bitsConsumed);
      }
      debug && console.log('Bits consumed by operator', bitsConsumed + 18);
      return bitsConsumed + 18;
    } else {
      return Infinity;
    }
  }
}

(async (files: string[]) => {
  for (const file of files) {
    const input = (await fs.readFile(`../inputs/${file}.txt`)).toString();
    const bits = input
      .split('')
      .map((v) => parseInt(v, 16).toString(2).padStart(4, '0'))
      .join('');
    parsePacket(bits, 0);
    console.log(`Version sum for ${file}`, versionSum);
    versionSum = 0;
  }
})([
  '16-example',
  '16-example-2',
  '16-example-3',
  '16-example-4',
  '16-example-5',
  '16-example-6',
  '16-example-7',
  '16',
]);

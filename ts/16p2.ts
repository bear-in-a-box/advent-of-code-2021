import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

const debug = false;

enum PacketType {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  GreaterThan = 5,
  LessThan = 6,
  Equal = 7,

  SingleValue = 4,
}

enum LengthType {
  Total = '0',
  Count = '1',
}

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

function parseOperation(type: PacketType, results: number[]): number {
  debug && console.log(PacketType[type], results.join(', '));
  switch (type) {
    case PacketType.Sum:
      return results.reduce((acc, v) => acc + v, 0);
    case PacketType.Product:
      return results.reduce((acc, v, i) => (i === 0 ? v : acc * v), 0);
    case PacketType.Minimum:
      return Math.min(...results);
    case PacketType.Maximum:
      return Math.max(...results);
    case PacketType.GreaterThan:
      return results[0] > results[1] ? 1 : 0;
    case PacketType.LessThan:
      return results[0] < results[1] ? 1 : 0;
    case PacketType.Equal:
      return results[0] === results[1] ? 1 : 0;
  }
  return NaN;
}

/**
 * @returns result and bits consumed
 */
function parsePacket(bits: string, start: number): [number, number] {
  debug && console.log('Reading from', start);
  const version = parseInt(bits.slice(start + 0, start + 3), 2);
  debug && console.log('Version', version);
  const typeId = parseInt(bits.slice(start + 3, start + 6), 2);
  debug && console.log('Type ID', typeId);
  if (typeId === PacketType.SingleValue) {
    debug && console.log('Packet is a single value container');
    const [value, bitsConsumed] = parseValueInPacket(bits, start + 6);
    debug && console.log('Value', value);
    debug && console.log('Bits consumed', bitsConsumed);
    return [value, bitsConsumed];
  } else {
    debug && console.log('Packet is an operator with subpackets');
    const lengthTypeId = bits[start + 6];
    if (lengthTypeId === LengthType.Total) {
      const totalLength = parseInt(bits.slice(start + 7, start + 7 + 15), 2);
      debug && console.log('Total length of subpackets', totalLength);
      const results: number[] = [];
      for (let i = 0; i < totalLength; ) {
        const [result, bitsConsumed] = parsePacket(bits, start + 7 + 15 + i);
        i += bitsConsumed;
        results.push(result);
      }
      debug && console.log('Bits consumed by operator', totalLength + 22);
      return [parseOperation(typeId, results), totalLength + 22];
    } else if (lengthTypeId === LengthType.Count) {
      const totalCount = parseInt(bits.slice(start + 7, start + 7 + 11), 2);
      debug && console.log('Total count of subpackets', totalCount);
      let bitsConsumed = 0;
      const results: number[] = [];
      for (let i = 0; i < totalCount; i++) {
        const [result, bitsConsumedThisTime] = parsePacket(
          bits,
          start + 7 + 11 + bitsConsumed
        );
        bitsConsumed += bitsConsumedThisTime;
        results.push(result);
      }
      debug && console.log('Bits consumed by operator', bitsConsumed + 18);
      return [parseOperation(typeId, results), bitsConsumed + 18];
    } else {
      return [0, NaN];
    }
  }
}

(async (files: string[]) => {
  for (const file of files) {
    const input = (await fs.readFile(`../inputs/${file}.txt`)).toString();
    const start = performance.now();
    const bits = input
      .split('')
      .map((v) => parseInt(v, 16).toString(2).padStart(4, '0'))
      .join('');
    const [result] = parsePacket(bits, 0);
    const end = performance.now();
    console.log(`Result for ${file}`, result);
    console.log('Time elapsed', end - start, 'ms');
  }
})(['16']);

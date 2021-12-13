import { promises as fs } from 'fs';

class SevenSegmentDisplay {
  private segments = {
    top: '',
    middle: '',
    bottom: '',

    topLeft: '',
    bottomLeft: '',
    topRight: '',
    bottomRight: '',

    right: [] as string[],
    left: [] as string[],
  };

  private cached = {
    two: [] as string[],
    six: [] as string[],
  };

  parse(input: string): number {
    if (input.length === 2) {
      return 1;
    }
    if (input.length === 3) {
      return 7;
    }
    if (input.length === 4) {
      return 4;
    }
    if (input.length === 7) {
      return 8;
    }
    if (input.length === 5) {
      // either 2, 3 or 5
      if (this.cached.two.every((c) => input.includes(c))) {
        return 2;
      }
      if (input.includes(this.segments.topLeft)) {
        return 5;
      }
      return 3;
    }
    if (input.length === 6) {
      // either 0, 6 or 9
      if (this.cached.six.every((c) => input.includes(c))) {
        return 6;
      }
      if (input.includes(this.segments.bottomLeft)) {
        return 0;
      }
      return 9;
    }

    return NaN;
  }

  calibrate(inputs: string[]) {
    const sorted = inputs
      .sort((a, b) => a.length - b.length)
      .map((thing) => thing.split(''));

    this.segments.right = [...sorted.shift()!]; // the shortest one is always 2 segments for a "1"
    const seven = sorted.shift()!; // the second one is 3-segment, and it represents "7"
    [this.segments.top] = seven.filter((c) => !this.segments.right.includes(c));

    const length5Things = sorted.filter((thing) => thing.length === 5);
    // three minus seven gives us bottom and middle segments.
    // removing these two and combining "twoOrFive"s will give us the left part
    const [bottomOrMiddle, twoOrFive1, twoOrFive2] = length5Things
      .map((thing) => thing.filter((c) => !seven.includes(c)))
      .sort((a, b) => a.length - b.length);
    const [four] = sorted.filter((thing) => thing.length === 4);

    [this.segments.bottom] = bottomOrMiddle.filter((c) => !four.includes(c));

    [this.segments.middle] = bottomOrMiddle.filter(
      (c) => c !== this.segments.bottom
    );

    [this.segments.topLeft] = four.filter(
      (c) => c !== this.segments.middle && !seven.includes(c)
    );

    const length6Things = sorted.filter((thing) => thing.length === 6);
    const [six] = length6Things.filter(
      (thing) => thing.filter((c) => !seven.includes(c)).length === 4
    );
    this.cached.six = six;
    [this.segments.bottomLeft] = six.filter(
      (c) =>
        !bottomOrMiddle.includes(c) &&
        !this.segments.right.includes(c) &&
        c !== this.segments.topLeft &&
        c !== this.segments.top
    );

    this.segments.left = [this.segments.topLeft, this.segments.bottomLeft];

    const [two] = [twoOrFive1, twoOrFive2].filter(
      (thing) => !thing.includes(this.segments.topLeft)
    );
    this.cached.two = two;
    [this.segments.topRight] = this.segments.right.filter(
      (c) => !two.includes(c)
    );
    [this.segments.bottomRight] = this.segments.right.filter(
      (c) => c !== this.segments.topRight
    );
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/08.txt')).toString();
  const lines = input.split('\n');
  let sum = 0;
  for (const [calibration, value] of lines.map((line) => line.split(' | '))) {
    let entryValue = 0;
    const display = new SevenSegmentDisplay();
    display.calibrate(calibration.trim().split(' '));
    for (const candidate of value.trim().split(' ')) {
      entryValue *= 10;
      entryValue += display.parse(candidate);
    }
    sum += entryValue;
  }
  console.log(sum);
})();

use std::time::Instant;

const DAYS: u16 = 256;

pub fn run(input: &str) {
    let values = input.split(',').map(|x| x.parse::<usize>().unwrap());
    let start = Instant::now();
    let mut state: Vec<u64> = vec![0u64; 9];
    for v in values {
        state[v] += 1;
    }
    let mut carry: u64 = 0;
    for _day in 0..DAYS {
        state[0] = 0;
        for i in 1..9 {
            state[i - 1] += state[i];
            state[i] = 0;
        }
        state[6] += carry;
        state[8] += carry;
        carry = state[0];
    }
    let size: u64 = state[0..=8].iter().sum();
    let end = Instant::now();
    println!("Result: {}", size);
    let duration = end.duration_since(start).as_micros();
    println!("Time elapsed: {} us", duration);
}

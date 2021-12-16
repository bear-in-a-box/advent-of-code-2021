use std::error::Error;
use std::fs;

// mod day04;
// mod day06;
mod day15;

fn main() -> Result<(), Box<dyn Error>> {
    let input = fs::read_to_string("../inputs/15.txt")?;
    // day04::part1(&input);
    // day06::run(&input);
    day15::run(&input, true);
    Ok(())
}

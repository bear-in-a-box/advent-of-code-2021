use std::error::Error;
use std::fs;

// mod day04;
mod day06;

fn main() -> Result<(), Box<dyn Error>> {
    let input = fs::read_to_string("../inputs/06.txt")?;
    // day04::part1(&input);
    day06::run(&input);
    Ok(())
}

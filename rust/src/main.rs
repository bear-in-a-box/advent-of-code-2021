use std::error::Error;
use std::fs;

mod day04;

fn main() -> Result<(), Box<dyn Error>> {
    let input = fs::read_to_string("../inputs/04.txt")?;
    day04::part1(&input);
    Ok(())
}

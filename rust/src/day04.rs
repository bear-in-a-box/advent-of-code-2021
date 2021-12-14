struct Bingo {
    values: Vec<Vec<u16>>,
    checks: Vec<Vec<bool>>,
}

impl Bingo {
    fn new(values: Vec<Vec<u16>>) -> Self {
        Bingo {
            values: values.clone(),
            checks: vec![vec![false; 5]; 5],
        }
    }

    fn draw(&mut self, value: u16) -> () {
        for y in 0..5 {
            for x in 0..5 {
                if self.values[y][x] == value {
                    self.checks[y][x] = true;
                    return;
                }
            }
        }
    }

    fn is_winner(&self) -> bool {
        for y in 0..5 {
            let mut row_match: bool = true;
            let mut col_match: bool = true;
            for x in 0..5 {
                row_match &= self.checks[y][x];
                col_match &= self.checks[x][y];
            }
            if row_match || col_match {
                return true;
            }
        }
        false
    }

    fn calculate_score(&self, winner_draw: u16) -> u32 {
        let mut sum: u32 = 0;
        for y in 0..5 {
            for x in 0..5 {
                if !self.checks[y][x] {
                    sum += u32::from(self.values[y][x]);
                }
            }
        }
        sum * u32::from(winner_draw)
    }
}

fn game(boards: &mut Vec<Bingo>, draws: Vec<u16>) -> Option<(&Bingo, u16)> {
    for draw in draws {
        for i in 0..boards.len() {
            boards[i].draw(draw);
            if boards[i].is_winner() {
                return Some((&boards[i], draw));
            }
        }
    }
    None
}

pub fn part1(input: &str) {
    let (draws_line, rest) = input.split_once('\n').unwrap();
    let draws: Vec<u16> = draws_line
        .split(',')
        .map(|x| x.parse::<u16>().unwrap())
        .collect();
    let mut boards: Vec<Bingo> = Vec::new();
    let board_values: Vec<u16> = rest
        .split_ascii_whitespace()
        .map(|x| x.parse::<u16>().unwrap())
        .collect();
    for board in board_values.chunks(25) {
        let board_data: Vec<Vec<u16>> = board.chunks(5).map(|c| Vec::from(c)).collect();
        boards.push(Bingo::new(board_data));
    }
    match game(&mut boards, draws) {
        Some((winner, winner_draw)) => {
            let score = winner.calculate_score(winner_draw);
            println!("Winner score (draw {}): {}", winner_draw, score);
        }
        None => println!("no winner"),
    }
}

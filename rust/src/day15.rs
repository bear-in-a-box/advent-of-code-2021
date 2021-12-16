use std::time::Instant;

struct Graph {
    distances: Vec<Vec<u64>>,
    visits: Vec<Vec<bool>>,
    risks: Vec<Vec<u8>>,
    n: usize,
}

impl Graph {
    fn new(risks: Vec<Vec<u8>>) -> Self {
        let n = risks.len();
        Self {
            risks,
            n,
            distances: vec![vec![u64::MAX; n]; n],
            visits: vec![vec![false; n]; n],
        }
    }

    fn visit_neighbor(&mut self, x: usize, y: usize, distance_so_far: u64) {
        if self.visits[y][x] || (x == 0 && y == 0) {
            return;
        }
        let distance_candidate = self.risks[y][x] as u64 + distance_so_far;
        if distance_candidate > self.distances[self.n - 1][self.n - 1] {
            return;
        }
        if distance_candidate < self.distances[y][x] {
            self.distances[y][x] = distance_candidate;
            self.run(x, y);
        }
    }

    fn run(&mut self, x: usize, y: usize) {
        if x == self.n - 1 && y == self.n - 1 {
            return;
        }
        self.visits[y][x] = true;
        if y > 0 {
            self.visit_neighbor(x, y - 1, self.distances[y][x]);
        }
        if x < self.n - 1 {
            self.visit_neighbor(x + 1, y, self.distances[y][x]);
        }
        if y < self.n - 1 {
            self.visit_neighbor(x, y + 1, self.distances[y][x]);
        }
        if x > 0 {
            self.visit_neighbor(x - 1, y, self.distances[y][x]);
        }
        self.visits[y][x] = false;
    }

    fn get_lowest_risk(&self) -> u64 {
        self.distances[self.n - 1][self.n - 1]
    }
}

fn parse_area(input: &str) -> Vec<Vec<u8>> {
    input
        .lines()
        .map(|line| {
            line.chars()
                .map(|c| c.to_digit(10).unwrap() as u8)
                .collect::<Vec<u8>>()
        })
        .collect::<Vec<Vec<u8>>>()
}

fn run_for_area(area: Vec<Vec<u8>>) -> u64 {
    let mut graph = Graph::new(area);
    graph.distances[0][0] = 0;
    graph.run(0, 0);
    graph.get_lowest_risk()
}

fn get_area(input: &str, part2: bool) -> Vec<Vec<u8>> {
    let tile = parse_area(input);
    if !part2 {
        return tile;
    }
    const TILE_SHIFTS: &[&[u8; 5]; 5] = &[
        &[0, 1, 2, 3, 4],
        &[1, 2, 3, 4, 5],
        &[2, 3, 4, 5, 6],
        &[3, 4, 5, 6, 7],
        &[4, 5, 6, 7, 8],
    ];
    let tile_len = tile.len();
    let mut area: Vec<Vec<u8>> = vec![vec![0u8; tile_len * 5]; tile_len * 5];
    for ty in 0..5 {
        for tx in 0..5 {
            for y in 0..tile_len {
                for x in 0..tile_len {
                    let v = tile[y][x] + TILE_SHIFTS[ty][tx];
                    area[y + tile_len * ty][x + tile_len * tx] = if v < 10 { v } else { v - 9 };
                }
            }
        }
    }
    area
}

pub fn run(input: &str, part2: bool) {
    if part2 {
        println!("Running part 2");
    } else {
        println!("Running part 1");
    }
    let start = Instant::now();
    let area = get_area(input, part2);
    let result = run_for_area(area);
    let end = Instant::now();
    let duration = end.duration_since(start).as_millis();
    println!("Result: {}", result);
    println!("Time elapsed: {} ms", duration);
}

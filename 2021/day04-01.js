const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let winning_positions = [
  [ 0, 1, 2, 3, 4],
  [ 5, 6, 7, 8, 9],
  [10,11,12,13,14],
  [15,16,17,18,19],
  [20,21,22,23,24],
  [ 0, 5,10,15,20],
  [ 1, 6,11,16,21],
  [ 2, 7,12,17,22],
  [ 3, 8,13,18,23],
  [ 4, 9,14,19,24]
]

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n\n')

let moves = inputs[0].split(',').map(el => parseInt(el))
let boards = inputs.slice(1).map(line => line.trim().replace("\n", ' ').split(/\s+/).map(el => parseInt(el)) )

// deep copy boards
var score_boards = JSON.parse(JSON.stringify(boards));

function is_winner(board){
  let winning_position_found = winning_positions.map(positions => {
    let winner = positions.map( position => board[position] == 'x').filter( value => value).length == 5;
    return winner;
  }).filter(winner => winner).length > 0
  return winning_position_found;
}

function play(moves, boards){
  try {
    moves.forEach((move, move_ix) => {
      score_boards.forEach((board, board_ix) => {
        new_board = board.map(val => val == move ? 'x' : val)
        boards[board_ix] = new_board
        if(is_winner(new_board)){
          throw [board_ix, move_ix, new_board, move];
        }
      });
    });
  }
  catch (winning_board_summary){
    return winning_board_summary;
  }
}

function score(board_summary){
  let board = board_summary[2];
  let winning_move = board_summary[3];
  let winning_score =board.filter(val => val != 'x').reduce((prev, current) => prev + current)*winning_move;
  return winning_score;
}

let winning_board_summary = play(moves, score_boards)
console.log(score(winning_board_summary));
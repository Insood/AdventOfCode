const math = require('mathjs');
const positions = 10;
const winning_score = 21;

// Calculate the move distribution based on 3d3
//           #
//         # # #
//         # # #
//         # # #
//       # # # # #
//       # # # # #
//     # # # # # # #
// 1 2 3 4 5 6 7 8 9 10
//          3d3 Roll

let outcomes = {};

for(let a = 1; a < 4; a++){
  for(let b = 1; b < 4; b++){
    for(let c = 1; c < 4; c++){
      let move = a + b + c;
      if(move in outcomes){
        outcomes[move] +=1;
      } else {
        outcomes[move] = 1;
      }
    }
  }
}

function precalculate_results(){
  let result = [];
  for(let position = 1; position <= positions; position++){
    let scores = [];
    for(let score = 0; score < winning_score; score++){
      let game_outcomes = [];
      for(let [move, game_count] of Object.entries(outcomes)){
        let new_position_mod = ((position + parseInt(move)) % 10)
        let new_position = (new_position_mod == 0) ? 10 : new_position_mod;
        let new_score = score + new_position;
        game_outcomes.push([new_position, new_score, game_count]);
      }
      scores[score] = game_outcomes;
    }
    result[position] = scores
  }
  return result;
}

const results = precalculate_results();

function calculate_win_count(turn, p1pos, p1score, p2pos, p2score){
  let p1_wincount = 0;
  let p2_wincount = 0;

  let game_outcomes = turn ? results[p1pos][p1score] : results[p2pos][p2score];
  game_outcomes.forEach( outcome => {
    let universe_splits = outcome[2];

    if(outcome[1] >= winning_score){
      if(turn){
        p1_wincount += universe_splits;
      } else {
        p2_wincount += universe_splits;
      }
    } else {
      let result;
      if(turn){
        result = calculate_win_count(!turn, outcome[0], outcome[1], p2pos, p2score);
      } else {
        result = calculate_win_count(!turn, p1pos, p1score, outcome[0], outcome[1]);
      }
      
      p1_wincount += universe_splits*result[0];
      p2_wincount += universe_splits*result[1];
    }
  })
  return [p1_wincount, p2_wincount];
}

let [player1position, player2position] = process.argv.slice(2, 4).map(v => parseInt(v))
let win_count = calculate_win_count(true, player1position, 0, player2position, 0);
console.log(Math.max(...win_count))

var _dice_roll = 1;
var roll_counter = 0;

function deterministic3d100(){
  let return_value = 0;

  for(let i = 0; i < 3; i++){
    return_value += _dice_roll;

    _dice_roll += 1
    if( _dice_roll > 100){
      _dice_roll = 1;
    }
  }

  roll_counter += 3;
  
  return return_value;
}

let player1score = 0;
let player2score = 0;
let turn = true; // true=player1, false=player2

let [player1position, player2position] = process.argv.slice(2, 4).map(v => parseInt(v))

function play(){
  while(player1score < 1000 || player1score < 1000){
    let move = deterministic3d100();

    if(turn){ // true=player1, false=player2
      player1position = (player1position+move) % 10;
      player1score += player1position == 0 ? 10 : player1position;
    } else {
      player2position = (player2position+move) % 10;
      player2score += player2position == 0 ? 10 : player2position;
    }

    //let out = [turn ? '1' : '2', player1position, player1score, player2position, player2score]
    //console.log(out.join('\t'))
    turn = !turn;
  }
}

play();

console.log(roll_counter * Math.min(player1score, player2score))
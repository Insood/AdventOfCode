const Jasmine = require('jasmine');
const jasmine = new Jasmine();

const A = 'A';
const B = 'B';
const C = 'C';
const D = 'D';

const MAX_DEPTH = 17;

// Halls can store 1 piece
// Rooms can store 2 pieces.
//    Room[0] stores the "bottom piece"
//    Room[1] is the "top piece"
//    Only the top piece can move out
let starting_state = [
  [],
  [],
  [C,C],
  [],
  [B,D],
  [],
  [A,A],
  [],
  [D,B],
  [],
  []
]

const hall_spots = [0,1,3,5,7,9,10];
const room_spots = [2,4,6,8];
const homes = { A: 2, B: 4, C: 6, D: 8 };
const step_energy = { A: 1, B: 10, C: 100, D: 1000 };

function deep_copy(object){
  return JSON.parse(JSON.stringify(object))
}

function input_to_structure(lines){
  let columns = lines[0].length;

  let structure = [];
  for(let i = 0; i < columns; i++){
    if(lines[0][i] == '.'){
      if(lines[1][i] == ' ') {
        structure.push([]);
      } else {
        let top = lines[1][i] == '.' ? false : lines[1][i];
        let bottom = lines[2][i] == '.' ? false : lines[2][i];
        structure.push([bottom, top].filter(piece => piece));
      }
    } else { // Piece in hall
      structure.push([lines[0][i]]);
    }
  }

  return structure;
}

// Checks if a piece at from_ix has a clear shot of moving to to_ix
// That is -- between from & to_ix, are all of the hall spots clear?
// We are guaranteed to have nobody standing outside of a room by the rules
function can_move_in_hall(state, from_ix, to_ix) {
  // const start = Math.min(from_ix, to_ix);
  // const end = Math.max(from_ix, to_ix);

  if(to_ix  > from_ix) {
    for(let i = from_ix + 1; i <= to_ix; i++) {
      if(room_spots.includes(i)) { continue; } // Nothing can be stopped outside of a room
      if(state[i].length != 0) { return false; } // Something in the hall is blocking
    }
  } else {
    for(let i = from_ix - 1; i >= to_ix; i--) {
      if(room_spots.includes(i)) { continue; } // Nothing can be stopped outside of a room
      if(state[i].length != 0) { return false; } // Something in the hall is blocking
    }
  }

  return true;
}

describe("can_move_in_hall", function() {
  it('can move backwards', function(){
    let sample_state = input_to_structure([
      'A......B...',
      '  . . . .  ',
      '  A . A B  '
    ])

    expect(can_move_in_hall(sample_state,7,4)).toBeTrue();
  });

  it("can't move into another piece", function(){
    let sample_state = input_to_structure([
      '...B...B...',
      '  . . . .  ',
      '  A . A B  '
    ])

    expect(can_move_in_hall(sample_state,7,3)).toBeFalsy();
  });
});

function move_energy(state, from_ix, to_ix) {
  let piece_to_move = state[from_ix].slice(-1)[0];
  let steps = 0;

  if(room_spots.includes(from_ix)){ // moving out of room
    if( state[from_ix].length == 2) { steps += 1; }
    else if (state[from_ix].length == 1) { steps += 2; }
  }
  const start = Math.min(from_ix, to_ix);
  const end = Math.max(from_ix, to_ix);
  steps += (end - start);

  if(room_spots.includes(to_ix)) {
    if(state[to_ix].length == 0) { steps += 2; }
    else if(state[to_ix].length == 1) { steps += 1;}
  }

  return step_energy[piece_to_move] * steps;
}

describe("move_energy", function() {
  it('1 step for A', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(move_energy(sample_state,0,1)).toEqual(1);
  });

  it('4 steps for B', function(){
    let sample_state = input_to_structure([
      '...B.......',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(move_energy(sample_state,3,7)).toEqual(40);
  });

  it('moving completely out of room', function(){
    let sample_state = input_to_structure([
      '...........',
      '  . . C .  ',
      '  . D C .  '
    ])

    expect(move_energy(sample_state,4,8)).toEqual(8000);
  });

  it('moving partially into room', function(){
    let sample_state = input_to_structure([
      '...........',
      '  C . . .  ',
      '  A D C .  '
    ])

    expect(move_energy(sample_state,2,6)).toEqual(600);
  });
});

function move_piece(state, from_ix, to_ix) {
  let copy = deep_copy(state);
  const piece_to_move = copy[from_ix].pop();
  copy[to_ix].push(piece_to_move);
  return copy;
}

describe("move_piece", function() {
  it('moving to room', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . . . .  ',
      '  A . . .  '
    ])

    expect(move_piece(sample_state,0,2)).toEqual([[],[],['A','A'],[],[],[],[],[],[],[],[]]);
  });

  it('moves out of room', function(){
    let sample_state = input_to_structure([
      '...........',
      '  . . . .  ',
      '  A . . .  '
    ])

    expect(move_piece(sample_state,2,0)).toEqual([[A],[],[],[],[],[],[],[],[],[],[]]);
  });
});

function can_move_to_room(state, from_ix, target_room_ix){
  let piece_to_move = state[from_ix].slice(-1)[0];

  // Can't move to a room that's not the piece's home
  if( homes[piece_to_move] != target_room_ix) { return false; }
  if( !can_move_in_hall(state, from_ix, target_room_ix)) { return false; }

  const pieces_at_destination = state[target_room_ix];
  const strangers_at_home = pieces_at_destination.some( piece_in_room => piece_in_room != piece_to_move);
  if(strangers_at_home) { return false; }
  else { return true; }
}

describe("can_move_to_room", function() {
  it('can move home', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_room(sample_state,0,2)).toBeTruthy();
  });

  it('cannot move into another home', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . . . D  ',
      '  A B A D  '
    ])

    expect(can_move_to_room(sample_state,0,6)).toBeFalsy();
  });

  it('cannot move home if stranger present', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . . . D  ',
      '  B B A D  '
    ])

    expect(can_move_to_room(sample_state,0,2)).toBeFalsy();
  });

  it('cannot move home if someone in the way', function(){
    let sample_state = input_to_structure([
      'AB.........',
      '  . . . D  ',
      '  A B A D  '
    ])

    expect(can_move_to_room(sample_state,0,2)).toBeFalsy();
  });

  it('can move backwards', function(){
    let sample_state = input_to_structure([
      '.......B...',
      '  . . . .  ',
      '  A . A B  '
    ]);
    expect(can_move_to_room(sample_state,7,4)).toBeTrue();

  });
});

function can_move_to_hall(state, from_ix, target_hall_ix) {
  let piece_to_move = state[from_ix].slice(-1)[0];

  // Can't move out if already home UNLESS there's a stranger in here
  if( homes[piece_to_move] == from_ix) {
    if(state[from_ix].every(piece => piece == piece_to_move)) { return false; } // All the pieces present are "home"
  }
  if(!can_move_in_hall(state, from_ix, target_hall_ix)) { return false; }

  return true;
}

describe("can_move_to_hall", function() {
  it('can move out when not home', function(){
    let sample_state = input_to_structure([
      'A..........',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_hall(sample_state,4,3)).toBeTruthy();
  });

  it("can't move out if blocked", function(){
    let sample_state = input_to_structure([
      '...A.......',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_hall(sample_state,4,3)).toBeFalsy();
  });

  it("can't move through if blocked", function(){
    let sample_state = input_to_structure([
      '...A.......',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_hall(sample_state,4,0)).toBeFalsy();
  });

  it("can't move out if home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  . A C D  ',
      '  A B C D  '
    ])
  });

  it("can't move out if both home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  A A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_hall(sample_state,2,1)).toBeFalsy();
  });

  it("can move out if stranger is home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  A A C D  ',
      '  B B C D  '
    ])

    expect(can_move_to_hall(sample_state,2,1)).toBeTruthy();
  });
  
  it("can move out if stranger is home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  B A C D  ',
      '  A B C D  '
    ])

    expect(can_move_to_hall(sample_state,2,1)).toBeTruthy();
  });

  it("can move out if both are not home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  B A B A  ',
      '  B A B A  '
    ])

    expect(can_move_to_hall(sample_state,2,1)).toBeTruthy();
  });


  it("can move out if both are not home", function(){
    let sample_state = input_to_structure([
      '...........',
      '  A B A B ',
      '  B B A B  '
    ])

    expect(can_move_to_hall(sample_state,6,1)).toBeTruthy();
  });
});

function is_final_state(state) {
  for(const [home_piece, room_ix] of Object.entries(homes)) {    
    if((state[room_ix].length != 2) || !state[room_ix].every(resident => resident === home_piece)) {
      return false;
    }
  }
  return true;
}

describe("is_final_state", function() {
  it('when final state is true', function(){
    let sample_state = input_to_structure([
      '...........',
      '  A B C D  ',
      '  A B C D  '
    ])

    expect(is_final_state(sample_state)).toBeTruthy();
  });

  it("when not final state", function(){
    let sample_state = input_to_structure([
      '...A.......',
      '  . A C D  ',
      '  A B C D  '
    ])

    expect(is_final_state(sample_state)).toBeFalsy();
  });

  it("when not final state", function(){
    let sample_state = input_to_structure([
      '...........',
      '  B A C D  ',
      '  B A C D  '
    ])

    expect(is_final_state(sample_state)).toBeFalsy();
  });
});

function moves_from_space(state, from_ix) {
  let possible_moves = [];

  if(hall_spots.includes(from_ix)) { // Wanting to move to room
    for( let room_spot_ix = 0; room_spot_ix < room_spots.length; room_spot_ix++ ){
      let target_room_ix = room_spots[room_spot_ix];

      if(can_move_to_room(state, from_ix, target_room_ix)) {
        let energy = move_energy(state, from_ix, target_room_ix);
        let new_state = move_piece(state, from_ix, target_room_ix);
        possible_moves.push({energy: energy, state: new_state, final_state: is_final_state(new_state)});
      }
    }
  } else if (room_spots.includes(from_ix)) { // Wanting to move out of room
    for(let hall_spot_ix = 0; hall_spot_ix < hall_spots.length; hall_spot_ix++){
      let target_hall_ix = hall_spots[hall_spot_ix];

      if(can_move_to_hall(state, from_ix, target_hall_ix)) {
        let energy = move_energy(state, from_ix, target_hall_ix);
        let new_state = move_piece(state, from_ix, target_hall_ix);
        possible_moves.push({energy: energy, state: new_state, final_state: is_final_state(new_state)});
      }
    }
  }
  return possible_moves;
}

// Returns an array of { energy: nnn, state: [...], final_state: true/false}
function moves_in_state(state) {
  let moves = [];
  for(let i = 0; i < state.length; i++) {
    if(state[i].length == 0) { continue; } // Nobody in this space
    let moves_from_this_space = moves_from_space(state, i);
    moves_from_this_space.map(move => moves.push(move))
  }
  return moves;
}

function step(state, energy, depth) {
  if(depth > MAX_DEPTH) { return false; }

  let next_states = moves_in_state(state);

  let lowest_energy_found = Infinity;

  next_states.forEach(function(next_state) {
    if(next_state.final_state) {
      if(energy + next_state.energy < lowest_energy_found){
        lowest_energy_found = energy + next_state.energy;
      }
    } else {
      let solution_energy = step(next_state.state, energy + next_state.energy, depth + 1);
      if(solution_energy && solution_energy  < lowest_energy_found) {
        lowest_energy_found = solution_energy;
      }
    }
  });

  if(lowest_energy_found != Infinity) { return lowest_energy_found; }
  else { return false; }
}

jasmine.execute();

const input = [
  '...........',
  '  C B A D  ',
  '  C D A B  '
];

sample_state = input_to_structure(input);
let lowest_energy_found = step(sample_state, 0, 0);
console.log(lowest_energy_found);
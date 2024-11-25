"use strict";

const fs = require('fs');

var values =
  [
    [ 1,  11,  6], // div, add1, add2
    [ 1,  13, 14],
    [ 1,  15, 14],
    [26,  -8, 10],
    [ 1,  13,  9],
    [ 1,  15, 12],
    [26, -11,  8],
    [26,  -4, 13],
    [26, -15, 12],
    [ 1,  14,  6],
    [ 1,  14,  9],
    [26,  -1, 15],
    [26,  -8,  4],
    [26, -14, 10]
  ];

function calculate(ix, w, z){
  let [div, add1, add2] = values[ix];

  // X is always either 1 or 0
  let x = ((z % 26) + add1) != w;

  // Either Z stays the same, or it is divided by 26
  z = Math.floor(z / div);

  z = z*(25*x + 1) + (w + add2)*x;

  return z;
}

let upper_z_search = 100000;
let max_z8_value = 0;

function find(ix, w, target_z_out){
  let result = [];
  for(let z_in = 0; z_in <= upper_z_search; z_in++){
    if(calculate(ix, w, z_in) == target_z_out){
      result.push(z_in);
    }
  }
  return result;
}

function recursive_find(ix, target_z_out, prev_digits)
{
  for(let w = 9; w > 0; w--){
    let results = find(ix, w, target_z_out);

    if(results.length > 0){
      for(let result_ix = 0; result_ix < results.length; result_ix++){
        let value_to_find = results[result_ix];
        var digits = [...prev_digits];
        digits.push(w);

        if(ix == 9) {
          if(value_to_find > max_z8_value){ 
            max_z8_value = value_to_find;
          }
        } else {
          recursive_find(ix - 1, value_to_find, digits);
        }
      }
    }
  }
}

recursive_find(13, 0, [])

function recursive_calculate(depth, prev_z, digits){
  for(let w = 9; w > 0; w--){
    let new_digits = [...digits]
    new_digits.push(w)

    let new_z = calculate(depth, w, prev_z);
    
    if(depth == 3) {
      console.log(new_digits.join(''));
    }

    if(depth == 8 && new_z > max_z8_value) {
      // Stop iteration here.
      // We've previously determined what are valid Z8 values
      // That will give us a Z13_out of 0
    }
    else if(depth == 13){
      if(new_z == 0) {
        console.log("FOUND!!")
        console.log(new_digits.join(''));
        throw Error("Completed");
      }
    } else {
      recursive_calculate(depth+1, new_z, new_digits);
    }
  }
}

recursive_calculate(0, 0, [])

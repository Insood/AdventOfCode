const fs = require('fs');
const { _, over, isNil } = require('lodash');
const { map } = require('mathjs');
const math = require('mathjs');

const input_file = process.argv.slice(2, 3)[0];

function parse_sensor_lines(sensor_lines){
  let lines = sensor_lines.split('\n');
  let scanner_id = parseInt(lines[0].replace(/[^0-9]*/g,''))
  let coordinates = lines.slice(1).map( line => line.split(",").map(c => parseInt(c)))
  return { scanner_id: scanner_id, coordinates: coordinates}
}

// Generate a list of all 24-possible rotations for a coordinate.
// [1,2,3] can be later used as symbols for [x1,x2,x3]
function rotations(){
  let first_rotation = [ 
    [0,           [0,1,0]],
    [math.pi/2,   [0,1,0]],
    [math.pi ,    [0,1,0]],
    [math.pi*3/2, [0,1,0]],
    [math.pi/2,   [1,0,0]],
    [math.pi*3/2, [1,0,0]]
  ]

  let second_rotation = [
    [0,           [0,0,1]],
    [math.pi/2,   [0,0,1]],
    [math.pi ,    [0,0,1]],
    [math.pi*3/2, [0,0,1]],
  ]

  let coordinate = [1, 2, 3];

  let output = [];

  for(let i = 0; i < first_rotation.length; i++){
    let t1 = first_rotation[i][0];
    let ax1 = first_rotation[i][1];
    let rot1 = math.rotationMatrix(t1,ax1);

    for(let j = 0; j < second_rotation.length; j++){
      let t2 = second_rotation[j][0];
      let ax2 = second_rotation[j][1];
      let rot2 = math.rotationMatrix(t2,ax2);
      let mx = math.multiply(coordinate, math.multiply(rot2, rot1));
      mx = mx.map(coordinate => math.round(coordinate))
      output.push(mx);
    }
  }

  return output;
}

// Takes a coordinate like (4, 10, 15) and a rotation hint
// like (-2, 1, 3) (e.g: -Y, X, Z) and then applies that rotation
// to return (-10, 4, 15)
function rotate(coordinate, rotation_hint){
  return [
    coordinate[Math.abs(rotation_hint[0])-1] * (rotation_hint[0] < 0 ? -1 : 1),
    coordinate[Math.abs(rotation_hint[1])-1] * (rotation_hint[1] < 0 ? -1 : 1),
    coordinate[Math.abs(rotation_hint[2])-1] * (rotation_hint[2] < 0 ? -1 : 1)
  ];
}

function rotate_point_cloud(points, rotation_hint){
  return points.map( point => rotate(point, rotation_hint));
}

// Number of overlapping points is calculated as follows:
// * Cloud1 is considered fixed in space
// * For each point X1 in cloud1:
//     * For each point X2 in cloud2:
//         * Translate point cloud2 by T, where X2 + T => X1 [or: T = X1-X2]
//         * Calculate point overlap
//         * If point overlap > 12
//             * Return Y
function point_cloud_overlap(cloud1, cloud2){
  for(let i = 0; i < cloud1.length; i++){
    for(let j = 0; j < cloud2.length; j++){
      let transform = math.subtract(cloud1[i],cloud2[j]);
      let aligned_cloud = cloud2.map(point => math.add(point, transform));
      let overlap = _.intersectionWith(cloud1, aligned_cloud, _.isEqual).length;
      if(overlap >= 12){
        return transform;
      }
    }
  }
}

function point_cloud_overlap_with_transform(global_cloud, cloud_rotation){
  for(let i = 0; i < cloud_rotation.length; i++){
    let transform = point_cloud_overlap(global_cloud, cloud_rotation[i]);
    if(transform) {
      return [transform, cloud_rotation[i]];
    }
  }
  return [null, null];
}

function assemble_global_cloud(cloud_rotations){
  let global_cloud = cloud_rotations.shift()[0]; // First rotation of the 1st scanner
  let scanner_locations = [];

  while(cloud_rotations.length > 0){
    console.log('Compacting cloud.. Clouds left: ' + cloud_rotations.length )
    for(let i = 0; i < cloud_rotations.length; i++){
      let cloud_rotation = cloud_rotations[i];
      let [transform, rotated_points] = point_cloud_overlap_with_transform(global_cloud, cloud_rotation);

      if(!transform) { continue; }

      scanner_locations.push(transform);
      let aligned_cloud = rotated_points.map(point => math.add(point, transform));
      aligned_cloud.forEach( point => global_cloud.push(point));
      global_cloud = global_cloud = _.uniqWith(global_cloud, _.isEqual)

      cloud_rotations.splice(i, 1);
      break;
    }
  }
  return [global_cloud, global_cloud.length, scanner_locations]
}

function generate_rotations(clouds){
  return clouds.map(cloud => rotation_hints.map(rotation => rotate_point_cloud(cloud, rotation)))
}

var rotation_hints = rotations();

let scans = fs.readFileSync(input_file, 'utf8')
              .trim()
              .split('\r\n\r\n')
              .map(sensor_lines => parse_sensor_lines(sensor_lines))

let clouds = scans.map(scan => scan['coordinates']);
let clouds_with_rotations = generate_rotations(clouds)
let [global_cloud, beacon_count, scanner_locations] = assemble_global_cloud(clouds_with_rotations);

function manhattan_distance(a,b){
  return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + Math.abs(b[2] - a[2]);
}

function max_distance(scanner_locations){
  let max = 0;

  for(let i = 0; i < scanner_locations.length; i++){
    for(let j = 0; j < scanner_locations.length; j++){
      if(i == j) { continue; }
      
      let a = scanner_locations[i];
      let b = scanner_locations[j];
      let dist = manhattan_distance(a,b);
      if(dist > max) { max = dist; }
    }
  }
  return max;
}

let max = max_distance(scanner_locations)
console.log(max);
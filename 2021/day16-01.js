const fs = require('fs');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let inputs = fs.readFileSync(input_file, 'utf8').trim().split('\n')

function hex2bin(hex) {
  return hex.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('')
}

function bin2int(bin) {
  return parseInt(bin, 2)
}

class SimpleStringStream {
  constructor(str) {
    this.str = str;
  }

  read(len) {
    let read_values = this.str.slice(0, len);
    this.str = this.str.slice(len);
    return read_values;
  }

  length() {
    return this.str.length;
  }
}

function read_literal(stream) {
  let literal_bin = '';
  while (true) {
    let cont = bin2int(stream.read(1));
    literal_bin += stream.read(4)

    if (!cont) { break }
  }
  return bin2int(literal_bin);
}

function debug(cmd, val, depth) {
  console.log(' '.repeat(depth) + cmd + ':' + val);
}

function read_operator(stream, depth) {
  let length_type = bin2int(stream.read(1));

  if (length_type == 1) { // 11-bits containing number of sub packets
    let subpacket_count = bin2int(stream.read(11));
    debug('SC', subpacket_count, depth)
    while (subpacket_count > 0) {
      parse_packet(stream, depth + 1)
      subpacket_count -= 1
    }
  } else { // 15-bits containing length in bits of sub-packets
    let subpacket_length = bin2int(stream.read(15));
    debug('SL', subpacket_length, depth)

    if (subpacket_length > 0) {
      let subpacket = stream.read(subpacket_length);
      let subpacket_stream = new SimpleStringStream(subpacket);

      while (subpacket_stream.length() > 0) {
        parse_packet(subpacket_stream, depth + 1);
      }
    }
  }
}

var global_version_sum = 0;

function parse_packet(stream, depth = 0) {
  let version = bin2int(stream.read(3))
  global_version_sum += version;
  let packet_type = bin2int(stream.read(3))

  debug('VER', version, depth)
  debug('TYPE', packet_type, depth)

  if (packet_type == 4) {
    let literal = read_literal(stream);
    debug('LIT', literal, depth)
  } else {
    read_operator(stream, depth);
  }
}

function parse_packets(inputs) {
  inputs.forEach(line => {
    let binary_string = hex2bin(line);
    let stream = new SimpleStringStream(binary_string);
    parse_packet(stream)
  });
}

parse_packets(inputs);
console.log(global_version_sum)
var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
var storage = require("./storage")
const {getCurrentGame} = require("./storage");
require('dotenv').config()

const SERIAL_PORT = process.env.SERIAL_PORT;
const status_light = 0;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

var currentGame = {}

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);


storage.getCurrentGame().then((data) => {
  data.forEach((game) => currentGame = game.data())
})

function getGame() {
  storage.getCurrentGame().then((data) => {
    data.forEach((game) => {
      currentGame = game.data()
    })
  })
}

xbeeAPI.parser.on("on", function (frame) {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: frame.remote64,
    command: "P2",
    commandParameter: [0x00],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: frame.remote64,
    command: "D3",
    commandParameter: [0x00],
  };
  xbeeAPI.builder.write(frame_obj);
})
xbeeAPI.parser.on("data", function (frame) {
  getGame()

  var currentGameValue = {
    user1: currentGame.user1,
    user2: currentGame.user2,
    endQuestion: currentGame.endQuestion,
  }

  // var frame_obj = { // AT Request to be sent
  //   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
  //   destination64: frame.remote64,
  //   command: "P2",
  //   commandParameter: [0x00],
  // };
  //
  // xbeeAPI.builder.write(frame_obj);
  //
  // frame_obj = { // AT Request to be sent
  //   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
  //   destination64: frame.remote64,
  //   command: "D3",
  //   commandParameter: [0x00],
  // };
  // xbeeAPI.builder.write(frame_obj);

  if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    getGame()
    console.log(currentGame)
    if (frame.digitalSamples.DIO11 === 0) {
      if (currentGame.valid === 1) {
        var frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
        xbeeAPI.builder.write(frame_obj);
        currentGameValue.endQuestion = 1
      } else {
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "D3",
          commandParameter: [0x05],
        };
        xbeeAPI.builder.write(frame_obj);
      }

      if (currentGameValue.user1 === 0) {
        currentGameValue.user1 = 1
        storage.addAnswer(currentGameValue)
      }
    }
    if (frame.digitalSamples.DIO1 === 0) {
      if (currentGame.valid === 2) {
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
        currentGameValue.endQuestion = 1
        xbeeAPI.builder.write(frame_obj);
      } else {
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "D3",
          commandParameter: [0x05],
        };
        xbeeAPI.builder.write(frame_obj);
      }
      if (currentGameValue.user1 === 0) {
        currentGameValue.user1 = 2
        storage.addAnswer(currentGameValue)
      }
    }

    if (frame.digitalSamples.DIO2 === 0) {
      if (currentGame.valid === 3) {
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
        currentGameValue.endQuestion = 1
        xbeeAPI.builder.write(frame_obj);
      } else {
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "D3",
          commandParameter: [0x05],
        };
        xbeeAPI.builder.write(frame_obj);
      }
      if (currentGameValue.user1 === 0) {
        currentGameValue.user1 = 3
        storage.addAnswer(currentGameValue)
      }
    }
  }
});

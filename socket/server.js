var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
var storage = require("./storage")
require('dotenv').config()



var question = {
  1: "2022",
  2: "2020",
  3: "2023",
  display: "En quelle année somme nous ?",
  valid: 1
}

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
);

var questions = []




serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  // var frame_obj = { // AT Request to be sent
  //   type: C.FRAME_TYPE.AT_COMMAND,
  //   command: "D0",
  //   commandParameter: ['0x05'],
  // };
  //
  // xbeeAPI.builder.write(frame_obj);

  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "D1",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  // frame_obj = { // AT Request to be sent
  //   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
  //   destination64: "0013A20041C34AB8",
  //   command: "D0",
  //   commandParameter: ['0x05'],
  // };
  // xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

//storage.listSensors().then((questions) => questions.forEach((question) => console.log(question.data())))
storage.listQuestions().then((questionsStorage) => {
  questionsStorage.forEach((question) => questions.push(question.data()))
  let index = Math.floor(Math.random() * questions.length)
  console.log(questions[index])
})

storage.addAnswer('answer').then(r => console.log(r))

xbeeAPI.parser.on("data", function (frame) {
  console.log(C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX)
  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
  }


  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    console.log("NODE_IDENTIFICATION");
    //storage.registerSensor(frame.remote64);
  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    if (frame.digitalSamples.DIO11 === 0) {
      if (question.valid === 1) {
        var frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
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

    }
    if (frame.digitalSamples.DIO1 === 0) {
      if (question.valid === 2) {
         frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
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

    }
    if (frame.digitalSamples.DIO2 === 0) {
      if (question.valid === 3) {
         frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: frame.remote64,
          command: "P2",
          commandParameter: [0x05],
        };
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

    }
    storage.registerSample(frame.remote64,frame.analogSamples.AD0 )

    //storage.registerSample(frame.remote64, frame.analogSamples.AD0);
  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    console.log("REMOTE_COMMAND_RESPONSE")

  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    console.log(dataReceived);
  }
});

var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
var storage = require("./storage")
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
  }
);

var questions = []

var question = {
  valid: 2,
  display: 'Qui sont les meilleurs duos de BD'
}

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

storage.listQuestions().then((questionsStorage) => {
  questionsStorage.forEach((question) => questions.push(question.data()))
  let index = Math.floor(Math.random() * questions.length)
})


xbeeAPI.parser.on("data", function (frame) {
  var answer = {
    answerID: null,
    playerID: frame.remote64,
    questionID: 1
  }
if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
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
      answer.answerID = 1
      storage.addAnswer(answer)

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
      answer.answerID = 2
      storage.addAnswer(answer)
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
      answer.answerID = 3
      storage.addAnswer(answer)
    }
    /*storage.registerSample(frame.remote64,frame.analogSamples.AD0 )

    //storage.registerSample(frame.remote64, frame.analogSamples.AD0);
  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    console.log("REMOTE_COMMAND_RESPONSE")

  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    console.log(dataReceived);
    */
  }
});

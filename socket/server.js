var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
//var storage = require("./storage");
require("dotenv").config();

const SERIAL_PORT = process.env.SERIAL_PORT;
const status_light = 0;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});

let serialport = new SerialPort(
  SERIAL_PORT,
  {
    baudRate: 9600,
  },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
  }
);

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  var frame_obj = {
    // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "D0",
    commandParameter: ["0x04"],
  };

  xbeeAPI.builder.write(frame_obj);

  var frame_obj = {
    // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "D0",
    commandParameter: [0x00],
  };
  xbeeAPI.builder.write(frame_obj);
});

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

xbeeAPI.parser.on("data", function (frame) {
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
    console.log("ZIGBEEeeeee_IO_DATA_SAMPLE_RX");
    console.log(frame.digitalSamples.DIO1);

    if (frame.digitalSamples.DIO1 === 0) {
      console.log("Apuis");
    } else if (frame.digitalSamples.DIO1 === 1) {
      console.log(status_light, "allumé");
    } else {
      console.log(status_light, "ettein");
    }

    //storage.registerSample(frame.remote64, frame.analogSamples.AD0);
  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    console.log("REMOTE_COMMAND_RESPONSE");
  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    console.log(dataReceived);
  }
});

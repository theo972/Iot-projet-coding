const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// module.exports.registerSensor = async function (address) {
//
//   const docRef = db.collection('questions').doc(address);
//
//   const sensor = {
//     address: address,
//     date: Date.now(),
//   }
//
//   await docRef.get().then((snapshotDoc)=> {
//     if (!snapshotDoc.exists)
//       docRef.set(sensor);
//     else
//       docRef.update(sensor);
//   })
// }
//
// module.exports.registerSample = async function (address, sample) {
//
//   const docRef = db.collection('questions').doc(address)
//     .collection('questions').doc(Date.now().toString());
//
//   const data = {
//     value: sample,
//     date: Date.now(),
//   }
//   await docRef.set(data);
//
//
// }

module.exports.addAnswer = async function (answer) {

  var date = new Date()

  const docRef = db.collection('answers').doc(date.toUTCString());
  const data = {
    answerID: answer.answerID,
    dateTime: Date.now(),
    playerID: answer.playerID,
    questionID: answer.questionID
  }

  await docRef.set(data);

}

module.exports.listQuestions = function () {

  const docRef = db.collection('questions');

  return docRef.get()

}


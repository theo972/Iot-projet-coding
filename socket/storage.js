const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


module.exports.addAnswer = async function (answer) {

  const docRef = db.collection('currentGame').doc('game');

  await docRef.get().then((snapshotDoc)=> {
    if (!snapshotDoc.exists)
      docRef.set(answer);
    else
      docRef.update(answer);
  })

  // await docRef.set(data);
}

module.exports.addGame = async function (game) {
  const date = new Date();

  const docRef = db.collection('game').doc(date.toUTCString());
  const data = {
    questionID: game.answerID,
    startDateTime: Date.now(),
    endDateTime: Date.now() + 30000,
    winnerID: game.winnerID
  }

  await docRef.set(data);
}

module.exports.listQuestions = function () {
  const docRef = db.collection('questions');

  return docRef.get()
}

module.exports.getCurrentGame = function () {
  const docRef = db.collection('currentGame')

  return docRef.get()
}

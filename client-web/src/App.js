import React, { useEffect, useState } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import db from "./index"

function App() {

  const [datas, setDatas] = useState([])
  useFirestoreConnect(() => [{
    collection: "questions/",
    storeAs: "questions",

  }])
  const questions = useSelector((state) => state.firestore.ordered.questions)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  let [scoreUser1, setScoreUser1] = useState(0);
  let [scoreUser2, setScoreUser2] = useState(0);
  const [questionsFiltred, setQuestionsFiltred] = useState([]);
  let [changequestion, setChangeQuestion] = useState(0);

  function getCurrentQuestion(data) {
    setCurrentQuestion({
      display: 'loading',
      answer1: 'loading',
      answer2: 'loading',
      answer3: 'loading',
      idQuestion: 0,
    })
    return new Promise(resolve => {
      setTimeout(() => {
        let index = Math.floor(Math.random() * data.length)
        setCurrentQuestion(data[index])
        if (questionsFiltred === []) {
          setQuestionsFiltred(questions);
          questionsFiltred.splice(index, 1)
        } else {
          questionsFiltred.splice(index, 1)
        }

        if (db !== undefined) {
          db.collection("currentGame").doc('game').update({
            endQuestion: 0,
            idQuestion: data[index].idQuestion,
            valid: data[index].valid,
            user1: 0,
            user2: 0,
            scoreUser1: scoreUser1,
            scoreUser2: scoreUser2
          }).then(r => console.log(r))
        }
        resolve(data);
      }, 1000);
    });
  }

  function getNextQuestion() {
    setCurrentQuestion({
      display: 'loading',
      answer1: 'loading',
      answer2: 'loading',
      answer3: 'loading',
      idQuestion: 0,
    })
    setTimeout(() => {
      let index = Math.floor(Math.random() * questions.length)
      setCurrentQuestion(questions[index])
      setChangeQuestion(0)
      var nextQuestion = {
        endQuestion: 0,
        idQuestion: questions[index].idQuestion,
        valid: questions[index].valid,
        user1: 0,
        user2: 0,
        scoreUser1: scoreUser1,
        scoreUser2: scoreUser2
      }
      db.collection("currentGame").doc('game').update(nextQuestion)
    }, 1000);
  }

  if (db !== undefined) {
    db.collection('currentGame').doc('game').onSnapshot(async function (data) {
      console.log(changequestion)
      if (data.data().endQuestion === 1) {
        if (data.data().user1 === currentQuestion.valid) {
          setScoreUser1(data.data().scoreUser1 + 1 )
        }
        if (data.data().user2 === currentQuestion.valid) {
          setScoreUser2(data.data().scoreUser2 + 1)
        }
        setChangeQuestion(1)
      }
    })
  }

  async function changeCurrentQuestion() {
    if (questions !== undefined) {
      await getCurrentQuestion(questions)

    }
  }

  useEffect(() => {
    if (changequestion === 1) {
      getNextQuestion()
    }
  }, [changequestion]);

  useEffect(() => {
    changeCurrentQuestion()
  }, [questions])

  return (
    <div className="app">
        <div className="score-section">
          Score Paris :  {scoreUser1}
        </div>
        <div className="score-section">
          Score Courbevoie :  {scoreUser2}
        </div>
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question </span>
            </div>
            <div className="question-text">
              {currentQuestion.display}
            </div>
          </div>
          <div className="answer-section">
            <button>
              { currentQuestion.answer1 }
            </button>

            <button>
              { currentQuestion.answer2 }
            </button>

            <button>
              { currentQuestion.answer3 }
            </button>

          </div>
        </>
    </div>
  );
}

export default App;

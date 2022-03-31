import React, { useEffect, useState } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import db from "./index";
import {doc, onSnapshot} from 'firebase/firestore';
import {
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";

function App() {

  const [datas, setDatas] = useState([])
  useFirestoreConnect(() => [{
    collection: "questions/",
    storeAs: "questions",

  }])
  const questions = useSelector((state) => state.firestore.ordered.questions)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  let questionsFiltred = [];


  function getCurrentQuestion(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        let index = Math.floor(Math.random() * data.length)
        setCurrentQuestion(data[index])
        if (questionsFiltred === []) {
          questionsFiltred = [...questions];
          questionsFiltred.splice(index, 1)
        } else {
          questionsFiltred.splice(index, 1)
        }
        db.collection("currentGame").doc('game').update({
          endQuestion: 0,
          idQuestion: data[index].idQuestion,
          valid: data[index].valid
        }).then(r => console.log(r))
        resolve(data);
      }, 1000);
    });
  }

  async function changeCurrentQuestion() {
    if (questions !== undefined) {
      await getCurrentQuestion(questions)

    }
  }

  useEffect(() => {
    changeCurrentQuestion().then(r => console.log(r))


    if (currentQuestion !== undefined && currentQuestion.endQuestion === 1) {
      getCurrentQuestion(questionsFiltred)

    }


    // if (questions)
    //   {
    //     const slice = questions
    //       .map((question) => ({x: question?.date, y: question?.value.toString()}))
    //       .slice(questions?.length - 50, questions?.length - 1);
    //     console.log(slice)
    //     setDatas(slice)
    //   }
  }, [questions])
  // db.collection('currentGame').doc('game').onSnapshot(function (data) {
  //   console.log(data.data())
  //   // if (data.data().endQuestion === 1) {
  //   //   getCurrentQuestion(questionsFiltred)
  //   // }
  // })
  return (
    <div className="app">
        <div className="score-section">
          You scored  out of
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

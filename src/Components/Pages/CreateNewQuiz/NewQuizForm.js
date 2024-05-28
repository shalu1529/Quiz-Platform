import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addQuiz } from "../../../Redux/Actions/Actions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import "./NewQuizForm.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateIcon from "@mui/icons-material/Create";

const NewQuizForm = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const questionRef = useRef();
  const answerRef = useRef();
  const CorrectAnswerRef = useRef();

  const [count, setCount] = useState(1);
  const [added, setAdded] = useState(false);
  const [answerDone, setAnswerDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const addedTimeout = setTimeout(() => {
      if (added) {
        setAdded(false);
      }
    }, 2000);

    const answerDoneTimeout = setTimeout(() => {
      if (answerDone) {
        setAnswerDone(false);
      }
    }, 2000);

    return () => {
      clearTimeout(addedTimeout);
      clearTimeout(answerDoneTimeout);
    };
  }, [added, answerDone]);

  const addOptionHandler = (event) => {
    event.preventDefault();
    if (answerRef.current.value === "") {
      return;
    }
    if (answers.length >= 4) {
      return;
    } else {
      const Answers = {
        answer: answerRef.current.value,
        correct: CorrectAnswerRef.current.checked,
        id: Math.random(),
      };
      setAnswers((prev) => [...prev, Answers]);
    }
    answerRef.current.value = "";
    CorrectAnswerRef.current.checked = false;
  };

  const addQuestionHandler = (e) => {
    e.preventDefault();

    if (questionRef.current.value === "") {
      return alert("Enter question!");
    }
    if (questionRef.current.value.length < 10) {
      return alert("Enter at least 10 characters in the Question!");
    }
    if (answers.length === 0) {
      return alert("Enter options!");
    }
    if (answers.length < 2) {
      return alert("Add at least 2 answers!");
    }

    const hasCorrectAnswer = answers.some((answer) => answer.correct);

    if (!hasCorrectAnswer) {
      return alert("Please mark at least one option as correct!");
    }

    const Question = {
      question: questionRef.current.value,
      answers: answers,
      id: count,
    };

    setCount(count + 1);
    setAdded(true);
    setQuestion((prev) => [...prev, Question]);
    setAnswers([]);
    questionRef.current.value = "";
  };

  const onSaveHandler = (event) => {
    event.preventDefault();

    if (titleRef.current.value === "" || descriptionRef.current.value === "") {
      return alert("Enter title and description");
    }
    if (question.length === 0) {
      return alert("Add questions!");
    }

    const Quiz = {
      description: descriptionRef.current.value,
      questions: question,
      title: titleRef.current.value,
      id: Math.random(),
      createdOn: new Date(),
      isActive: true,
    };

    dispatch(addQuiz(Quiz));
    setCount(1);
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    navigate("/play-quiz");
  };

  const deleteHandler = (id) => {
    const newAnswers = answers.filter((el) => el.id !== id);
    setAnswers(newAnswers);
  };

  return (
    <>
      <div className="heading">
        <h1>CREATE NEW QUIZ</h1>
      </div>
      <div className="outline">
        <div className="quizForm">
          <form action="" onSubmit={onSaveHandler}>
            <div className="upper">
              <input
                type="text"
                placeholder="Title"
                name="title"
                className="title"
                maxLength={30}
                minLength={10}
                required
                ref={titleRef}
              />
              <input
                type="text"
                className="description"
                placeholder="Add Description"
                required
                ref={descriptionRef}
              />
            </div>

            <div className="QA">
              <label htmlFor="question">Question {count}</label>
              <TextField
                placeholder="Enter your question"
                variant="outlined"
                fullWidth
                inputRef={questionRef}
                inputProps={{ maxLength: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CreateIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "20px",
                    },
                  },
                }}
              />
              {added && <p> Your question is added! </p>}
              {answerDone && <p>Add at least 2 answers!</p>}
            </div>

            <div className="answerSection">
              <TextField
                placeholder="Enter options "
                variant="outlined"
                inputRef={answerRef}
                inputProps={{ maxLength: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CreateIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "20px",
                    },
                  },
                }}
              />
              <div className="checkBox">
                <input
                  type="checkbox"
                  id="check"
                  name="correct"
                  ref={CorrectAnswerRef}
                  style={{ marginRight: "10px", border: "none" }}
                />
                <h4>Correct</h4>
                <Button
                  sx={{ marginLeft: "10px", cursor: "pointer" }}
                  variant="contained"
                  onClick={addOptionHandler}
                >
                  <AddCircleIcon fontSize="large" variant="contained" />
                </Button>
              </div>
            </div>
            <div className="viewAnswer">
              {answers.map((el, i) => {
                return (
                  <div
                    className="option"
                    key={i}
                    style={
                      el.correct
                        ? { background: "#32a84e" }
                        : { background: "#D1D1D1" }
                    }
                  >
                    <p style={{ overflowWrap: "break-word", width: "100px" }}>
                      {el.answer}
                    </p>
                    <Button
                      size="small"
                      onClick={() => deleteHandler(el.id)}
                      sx={{ height: "50%", color: "black" }}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="questionBtn">
              <Button variant="contained" onClick={addQuestionHandler}>
                Add Question
              </Button>
            </div>
            <hr />
            <input
              style={{ cursor: "pointer" }}
              id="submitBtn"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NewQuizForm;

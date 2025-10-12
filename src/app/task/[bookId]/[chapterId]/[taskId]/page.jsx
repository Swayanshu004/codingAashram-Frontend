"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Loader from "@/components/Loader";

// TaskPage Component
const TaskPage = ({params}) => {
  const [load, setLoad] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [resourse, setResourse] = useState([]);

  const [qsScore, setQsScore] = useState(0);
  const [exScore, setExScore] = useState(0);
  const [questionCheck, setQuestionCheck] = useState(false);
  const [exerciseCheck, setExerciseCheck] = useState(false);

  useEffect(()=> {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/openedTask/${params.bookId}/${params.chapterId}/${params.taskId}`, {  
      headers: { 
        "authorization" : localStorage.getItem("jwtToken") 
      }
    })
    .then(res => { 
      const task = res.data.task;
      if (res.data.task.exercises && Array.isArray(res.data.task.exercises) && Array.isArray(res.data.task.questions) && Array.isArray(res.data.task.resources)) {
        setQuestions(task.questions);
        setExercise(task.exercises);
        setResourse(task.resources);
        setLoad(false);
      }
    })
    .catch(err => console.error(err));
  },[params.bookId,params.chapterId,params.taskId])

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    let tempScore = 0;

    const formData = new FormData(e.target);
    questions.forEach((item, index) => {
      const selectedAnswer = formData.get(`question${index}`);
      console.log(item.options[item.correctOption] === selectedAnswer);
      console.log(selectedAnswer);
      
      if (selectedAnswer === item.options[item.correctOption]) {
        tempScore += 1;
      }
    });
    setQsScore(tempScore);
    if(tempScore === questions.length){
      setQuestionCheck(true);
      setQsScore(0)
    }
    console.log(qsScore);
    
  };

const handleSubmitExercise = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    exercise.forEach((item, index) => {
      const userAnswer = formData.get(`exercise${index}`);
      const isCorrect = userAnswer === item.answer;
      console.log(item.answer," - ",userAnswer);
      
      if(isCorrect){
        setExScore(exScore+4);
      }
      if(exScore === exercise.length){
        setExerciseCheck(true);
      }
    })
  };
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center overflow-hidden">
      {
        load ?
        <Loader/> :
        <div className="w-full bg-black rounded-lg shadow-lg flex flex-col h-full">
          <div className="flex flex-col overflow-hidden w-full">

            <div className="flex-1 p-6 overflow-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 ml-4">Questions:</h3>
                <div className="bg-neutral-950 py-4 px-10 rounded-2xl">
                  <form onSubmit={handleSubmitQuestion}>                  
                    {questions.map((item, index) => (
                      <div
                      key={index}
                      className="mb-7">
                      <h2 className="font-mono text-xl my-2 text-[#ff4d00]">{item.question}</h2>
                      <label>
                        {item.options.map((i,optionIndex)=>(
                          <div 
                          key={optionIndex}
                          className="my-1">
                            <input 
                            type="radio" 
                            name={`question${index}`} 
                            value={i} 
                            className="text-black"
                            required />
                            <span className="mx-4">{i}</span>
                          </div>
                        ))}
                      </label>
                      </div>
                    ))}
                    <div className="flex justify-end mt-2">
                      <button 
                      type="submit"
                      className="bg-[#ff4d00] text-white px-10 py-2 rounded-md shadow">
                        Check
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 ml-4">Excercise :</h3>
                <div className="bg-black py-4 px-10 rounded-2xl">
                <form onSubmit={handleSubmitExercise}>
                  {exercise.map((item, index) => (
                    <div key={index} className="mb-7 w-full">
                      <h2 className="font-mono text-xl my-2 text-[#ff4d00]">{item.task}</h2>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-7">
                        <label className="w-full">
                          <input 
                            type="text" 
                            placeholder="only single line code here . . " 
                            name={`exercise${index}`} // Unique name for each task
                            className="bg-neutral-200 text-black h-12 px-4 rounded-md w-full"
                            required // Ensure that the user must provide an input
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  <div className="">
                    <button
                      type="submit"
                      className="bg-[#ff4d00] text-white px-10 py-2 rounded-md shadow">
                      Check
                    </button>
                  </div>
                </form> 
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold mb-4 ml-4">Score Board :</h1>
                <div className="mb-10 p-10 rounded-xl w-full bg-neutral-800 flex items-center justify-around">
                <h1 className="text-lg font-semibold">Question Score: 
                  <span 
                  className={`${qsScore-questions.length === 0 ? "text-green-500" : "text-amber-500"} ml-4 text-2xl`}
                  >{qsScore} / {questions.length}
                  </span>
                </h1>
                <span className="text-neutral-500 ">|</span>
                <h1 className="text-lg font-semibold">Exercise Score: 
                  <span 
                  className={`${exScore-exercise.length === 0 ? "text-green-500" : "text-amber-500"} ml-4 text-2xl`}
                  >{exScore} / {exercise.length}
                  </span>
                </h1>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 ml-4">Resource :</h3>
                <div className="bg-black py-4 px-10 rounded-2xl flex flex-col lg:flex-row items-center justify-around gap-5">
                  {resourse.map((item, index) => (
                    <div 
                    key={index}
                    className="w-full">
                      <Link href={item.link}>
                      <div className="bg-neutral-800 w-full py-10 rounded-md hover:bg-neutral-700 text-center">{item.type}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex  justify-end">
                <Link href={"/"} className={`${questionCheck && exerciseCheck ? "" : "pointer-events-none"}`}>
                  <button className="bg-[#ff4d00] text-white px-6 py-2 rounded-lg shadow">
                    Submit
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default TaskPage;

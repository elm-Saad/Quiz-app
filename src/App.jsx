import React from 'react'
import Quizzical from './component/Quizzical'
import Quiz from './component/Quiz'
import blobUp from './assets/blob-up.svg'
import blobDown from './assets/blob-down.svg'

function App() {
  //handle first run of the Quiz
  const [isWorking, setIsWorking]=React.useState(false)

  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false) // Track form submission status
  const [quizended, setQuizEnded] = React.useState(false) // Track the Quiz status
  const [userScore, setUserScore] = React.useState(null) // Track the user score
  const [quizData, setQuizData] = React.useState({ results: [] }) //initialize  the Quiz data
  const [userSelections, setUserSelections] = React.useState(Array(quizData.results?.length || 0).fill(''))// track the user option
  const [replayQuiz, setReplayQuiz] = React.useState(false) // Track the replayQuiz

  // Function to fetch quiz data from the API
  const fetchQuizData = () => {
    fetch('https://opentdb.com/api.php?amount=7&category=18')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setQuizData(data)
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error)
      })
  }

  React.useEffect(() => {
    fetchQuizData()
  }, [])

  const [formData, setFormData] = React.useState({
    // Initialize the state for this quiz with empty object
    quiz_0:'',
    quiz_1:'',
    quiz_2:'',
    quiz_3:'',
    quiz_4:'',
    quiz_5:'',
    quiz_6:''
  })
    
  function handleChange(event) {
      const { name, value } = event.target
      setFormData({
        ...formData,
        [name]: value,
      })
  }

  const handleCorrectOptions = (questionIndex) => {
    const correctOption = quizData.results[questionIndex].correct_answer
    return [correctOption]
  }

  function handleQuizzicalStart(){
    setIsWorking(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    setIsFormSubmitted(true) // Mark the form as submitted

    // Check if all questions are answered
    const allAnswered = Object.values(formData).every((value) => value !== '')
    if (allAnswered) {
      // Calculate user's score
      let score = 0
      const updatedUserSelections = [...userSelections]
      quizData.results.forEach((item, index) => {
        if (formData[`quiz_${index}`] === item.correct_answer) {
          score += 1
        }
        // Update user selections
        updatedUserSelections[index] = formData[`quiz_${index}`]
      })
      setUserScore(score)
      setUserSelections(updatedUserSelections)
      setQuizEnded(true)
    }

  }

  // Define a function to reset replayQuiz
  const resetReplayQuiz = () => {
    setReplayQuiz(false)
  }

  const handleRestart = () => {
    setFormData({
      quiz_0:'',
      quiz_1:'',
      quiz_2:'',
      quiz_3:'',
      quiz_4:'',
      quiz_5:'',
      quiz_6:''
    }) // Reset form data
    setIsFormSubmitted(false)
    setUserSelections(Array(quizData.results?.length || 0).fill('')) // Reset user selections
    setQuizEnded(false)
    setUserScore(null)
    fetchQuizData()// Refetch quiz data
    setReplayQuiz(true) // Set replayQuiz to true to trigger a replay in Quiz components
  }

  return (
    <main>
      {
        isWorking?
        <div className="quiz--body">
          <form onSubmit={handleSubmit} className='form--element'>
            {
              quizData.results.map((data, index) => (
                <Quiz 
                  key={index}
                  id={index}
                  data={data}
                  formData={formData}
                  isFormSubmitted={isFormSubmitted}
                  onInputChange={handleChange}
                  quizended={quizended}
                  correctOptions={handleCorrectOptions(index)}
                  userSelection={userSelections[index]}
                  replayQuiz={replayQuiz}
                  resetReplayQuiz={resetReplayQuiz}
                />
              ))
            }
            <img className='blob--up blob--up--quiz' src={blobUp} alt="" />
            <img className='blob--down blob--down--quiz' src={blobDown} alt="" />
            {!quizended && <button className='Check--answers--btn' type="submit">Check answers</button>}
          </form>
          {quizended &&
            <div className='result'>
              <h2>Your Score {userScore} / {quizData.results.length} correct answers</h2>
              <button onClick={handleRestart}>New Quiz</button>
            </div>
          }
        </div>
        :
        <Quizzical
          handleQuizzicalStart={()=>handleQuizzicalStart()}
        />
      }
    </main>
  )
}

export default App

import React from 'react'
import {decode} from 'html-entities'

export default function Quiz({ data,replayQuiz,resetReplayQuiz,formData, onInputChange ,id, isFormSubmitted,quizended,correctOptions,userSelection}){

    const quizName = `quiz_${id}` // Use a unique name for each quiz

    const [isEmpty, setIsEmpty] = React.useState(false)

    const initialCombinedAnswers = [data.correct_answer, ...data.incorrect_answers].sort(() => Math.random() - 0.5)

    //source of option => combinedAnswers
    const [combinedAnswers, setCombinedAnswers] = React.useState(initialCombinedAnswers)

    React.useEffect(() => {
        if (replayQuiz) {
            const newCombinedAnswers = [data.correct_answer, ...data.incorrect_answers]
            newCombinedAnswers.sort(() => Math.random() - 0.5)
            setCombinedAnswers(newCombinedAnswers)

            resetReplayQuiz()// reset replayQuiz in the <App />
        }
    }, [data])
    
    React.useEffect(() => {
        // Check if the field is empty when the form is submitted
        if (isFormSubmitted) {
          setIsEmpty(formData[quizName] === '')
        }
    }, [isFormSubmitted, formData, quizName])

    // Determine if the selected option for this question is correct
    const isUserSelectionCorrect = correctOptions.includes(userSelection)
    return(
        <div className='question--body'>
            <p>{decode(data.question)}</p>
            <fieldset>
                {combinedAnswers.map((combinedAnswers, index) => (
                <div key={index}>
                    <label 
                        htmlFor={quizName + index} 
                        className={
                            quizended?
                            (
                                formData[quizName] === combinedAnswers? 
                                (isUserSelectionCorrect?'bg--green':'bg--red faded-text'):
                                (correctOptions.includes(combinedAnswers)?'bg--green':'')
                            ):
                            (
                                (formData[quizName] === combinedAnswers)?
                                'checked':
                                '' 
                            )
                        }
                    >
                        <input
                            type="radio"
                            id={quizName + index}
                            name={quizName} // Use a unique name for each quiz
                            value={combinedAnswers}
                            checked={formData[quizName] === combinedAnswers}
                            onChange={onInputChange} 
                            disabled={quizended} // Disable the input after the game has ended

                        />
                    {decode(combinedAnswers)}
                    </label>
                </div>
                ))}
            </fieldset>
            {isFormSubmitted  && isEmpty && (
                    <div className="error-message">Choose an option</div>
            )}
        </div>
    )
}
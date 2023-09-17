import React from 'react'
import blobUp from '../assets/blob-up.svg'
import blobDown from '../assets/blob-down.svg'


export default function Quizzical(props){
    return (
        <div className='front--page'>
            <div className="container">
                <h1>Quizzical</h1>
                <p>Challenge Your Knowledge with Quizzical</p>
                <button onClick={props.handleQuizzicalStart}>Start quiz</button>
            </div>
            <img className='blob--up' src={blobUp} alt="" />
            <img className='blob--down' src={blobDown} alt="" />
        </div>
    )
}
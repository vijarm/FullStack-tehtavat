import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
      {props.text}
    </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {

  if (props.all === 0) {
    return (
        <p>No feedback given</p>
    )
  }

  return (
  <table>
    <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={props.all} />
      <StatisticLine text="average" value={(props.palaute / props.all).toFixed(2)} />
      <StatisticLine text="positive" value={ (100* props.good / props.all).toFixed(2) + " %" } /> 
    </tbody>
  </table>
  )
}



const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [palaute, setPalaute] = useState(0)

  const HandleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
    setPalaute(palaute + 1)
  }

  const HandleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const HandleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
    setPalaute(palaute - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={HandleGoodClick} text="good" />
      <Button onClick={HandleNeutralClick} text="neutral" />
      <Button onClick={HandleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} palaute={palaute} /> 
    </div>
  )
}

export default App
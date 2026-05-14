const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header kurssi={course.name} />
      <Content sisalto={course.parts} />
      <Total summa={course.parts} />
    </div>
  )
}

const Header = (props) => {
  console.log(props)
  return (
    <h1>{props.kurssi}</h1>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part osa={props.sisalto[0]} />
      <Part osa={props.sisalto[1]} />
      <Part osa={props.sisalto[2]} />
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  return (
    <p>Number of exercises {props.summa[0].exercises + props.summa[1].exercises + props.summa[2].exercises}</p>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>
      {props.osa.name} {props.osa.exercises}
    </p>
  )
}

export default App
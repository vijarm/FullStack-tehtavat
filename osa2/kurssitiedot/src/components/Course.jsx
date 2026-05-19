const Course = ({ course }) => {
  console.log("Courseen syötetty: ", course)
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = ({course}) => <h1>{course.name}</h1>

const Content = ({course}) => {
  
  return (
    <div>
      {course.parts.map(osa => <Part key={osa.id} part={osa} />)}
    </div>
  )
}

const Part = ({part}) => {
  
  return (
  <p>
    {part.name} {part.exercises}
  </p>
  )
}

const Total = ({course}) => {
  
  const summa = course.parts.reduce( (sum, osa) => sum + osa.exercises, 0)
    
  return (
  <p>Number of exercises {summa}</p>
  )
}


export default Course
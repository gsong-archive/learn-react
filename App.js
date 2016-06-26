import React from 'react'
import ReactDOM from 'react-dom'
import {Provider, connect} from 'react-redux'
import {combineReducers, createStore} from 'redux'


// Reducers
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }

    case 'TOGGLE_TODO':
      if (state.id != action.id) {
        return state
      }

      return {
        ...state,
        completed: !state.completed
      }

    default:
      return state
  }
}

const todos = (state=[], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)]

    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))

    default:
      return state
  }
}

const visibilityFilter = (state='SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter

    default:
      return state
  }
}

const todoApp = combineReducers({todos, visibilityFilter})


// Action creators
let nextTodoId = 0;
const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

const toggleTodo = id => ({type: 'TOGGLE_TODO', id})

const setVisibilityFilter = filter => ({type: 'SET_VISIBILITY_FILTER', filter})


// Utilities
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos

    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)

    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
  }
}


// Presentational components
let AddTodo = ({dispatch}) => {
  let input;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        dispatch(addTodo(input.value))
        input.value = ''
      }}
    >
      <input ref={node => input = node} />
      <button type="submit">Add Todo</button>
    </form>
  )
}
AddTodo = connect()(AddTodo)

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

const Footer = () => (
  <div>
    Show:
    {' '}
    <FilterLink filter="SHOW_ALL">All</FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </div>
)

const Link = ({active, onClick, children}) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href="#"
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}


// Container components
const mapStateToTodoListProps = ({todos, visibilityFilter}) => ({
  todos: getVisibleTodos(todos, visibilityFilter)
})
const mapDispatchToTodoListProps = dispatch => ({
  onTodoClick(id) {dispatch(toggleTodo(id))}
})
const VisibleTodoList = connect(
  mapStateToTodoListProps, mapDispatchToTodoListProps
)(TodoList)


const mapStateToLinkProps = ({visibilityFilter}, {filter}) => ({
  active: filter === visibilityFilter
})
const mapDispatchToLinkProps = (dispatch, {filter}) => ({
  onClick() {dispatch(setVisibilityFilter(filter))}
})
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link)


const TodoApp = ({todos, visibilityFilter}) => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)


ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('app')
)

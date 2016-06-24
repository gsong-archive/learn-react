import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers, createStore} from 'redux';


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
const store = createStore(todoApp);


let nextTodoId = 0;


const FilterLink = ({filter, currentFilter, children}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }

  return (
    <a href="#"
      onClick={(e) => {
        e.preventDefault()
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }}
    >
      {children}
    </a>
  )
}


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


class TodoApp extends React.Component {
  addTodo(value) {
    store.dispatch({
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: value
    })
  }

  render() {
    const {todos, visibilityFilter} = this.props

    const visibleTodos = getVisibleTodos(todos, visibilityFilter)

    return (
      <div>
        <form
          onSubmit={() => {
            this.addTodo(this.input.value)
            this.input.value = ''
          }}
        >
          <input ref={node => this.input = node} />
          <button type="submit">Add Todo</button>
        </form>
        <ul>
          {visibleTodos.map(todo =>
            <li
              key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                })
              }}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            >
              {todo.text}
            </li>
          )}
        </ul>
        <div>
          Show:
          {' '}
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
            All
          </FilterLink>
          {', '}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
            Active
          </FilterLink>
          {', '}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </div>
      </div>
    )
  }
}


const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById('app')
  )
}

store.subscribe(render)
render()

import { connect } from 'react-redux';

import TodoList from './TodoList';
import { toggleTodo } from '../actions';


const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;

    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);

    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);

    default:
      throw new Error(`Unknown filter: ${filter}.`);
  }
};


const mapStateToTodoListProps = ({ todos, visibilityFilter }) => ({
  todos: getVisibleTodos(todos, visibilityFilter),
});

const mapDispatchToTodoListProps = dispatch => ({
  onTodoClick(id) { dispatch(toggleTodo(id)); },
});

const VisibleTodoList = connect(
  mapStateToTodoListProps, mapDispatchToTodoListProps
)(TodoList);

export default VisibleTodoList;

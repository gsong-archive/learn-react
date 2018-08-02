import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import TodoList from './TodoList';
import { getVisibleTodos } from '../reducers';
import { toggleTodo } from '../actions';


const mapStateToTodoListProps = (state, { params }) => ({
  todos: getVisibleTodos(state, params.filter || 'all'),
});

const VisibleTodoList = withRouter(connect(
  mapStateToTodoListProps, { onTodoClick: toggleTodo }
)(TodoList));

export default VisibleTodoList;

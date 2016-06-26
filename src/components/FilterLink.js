import { connect } from 'react-redux';

import Link from './Link';
import { setVisibilityFilter } from '../actions';


const mapStateToLinkProps = ({ visibilityFilter }, { filter }) => ({
  active: filter === visibilityFilter,
});


const mapDispatchToLinkProps = (dispatch, { filter }) => ({
  onClick() { dispatch(setVisibilityFilter(filter)); },
});


const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

export default FilterLink;

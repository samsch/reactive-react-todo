import React from 'react';
import PropTypes from 'prop-types';

class Pick extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      render: false,
    };
  }
  subscribe (observable) {
    const handleUpdate = data => {
      this.setState({ data, render: true });
    };
    observable.onValue(handleUpdate);
    this.unsubscribe = () => {
      observable.offValue(handleUpdate);
    };
  }
  componentDidMount () {
    this.subscribe(this.props.observable);
  }
  componentDidUpdate (prevProps) {
    if (prevProps.observable !== this.props.observable) {
      this.unsubscribe();
      this.subscribe(this.props.observable);
    }
  }
  componentWillUnmount () {
    this.unsubscribe();
  }
  render () {
    if (this.state.render) {
      return this.props.children(this.state.data);
    }
    return null;
  }
}
Pick.propTypes = {
  children: PropTypes.func.isRequired,
  observable: PropTypes.object.isRequired,
};
export default Pick;

/* eslint-disable react/display-name */
export const withPick = Component => props => (
  <Pick observable={props.observable}>
    {data => <Component {...props} {...data} />}
  </Pick>
);
/* eslint-enable react/display-name */

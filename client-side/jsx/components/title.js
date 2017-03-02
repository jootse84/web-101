import React from 'react'

export default class Title extends React.Component {
  render() {
    return (<div className="col-sm-12">
      <h1> {this.props.text} </h1>
    </div>)
  }
}

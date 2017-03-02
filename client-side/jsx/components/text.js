import React from 'react'

export default class Text extends React.Component {

  constructor(props) {
    super(props)
    this.state = {value: props.value}
    // This binding is necessary to make 'this' work in the callback
    this.handleChange = this.handleChange.bind(this)
    this.val = this.val.bind(this)
  }

  val() {
    return this.state.value 
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  render() {
    let { name, label, disabled, required } = this.props
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input
          type="text"
          name={name}
          onChange={this.handleChange}
          value={this.state.value}
          className="form-control"
          placeholder={label}
          required={required}
          disabled={disabled} />
      </div>
    )
  }
}

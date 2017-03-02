import React from 'react'
import Text from './text'

export default class Form extends React.Component {

  constructor(props) {
    super(props)
    // This binding is necessary to make 'this' work in the callback
    this.handleClick = this.handleClick.bind(this)
  }

  success() {
    let {refreshTable, hideSpinner} = this.props
    this.state({
      textId: "",
      textName: "",
      textDescription: ""
    })
    hideSpinner()
    refreshTable()
  }

  handleClick() {
    let { showSpinner } = this.props
    let { textId, textName, textDescription } = this.refs
    let id = textId.val()
    showSpinner()

    $.ajax({
      type: 'PUT',
      url: `http://localhost:3000/api/posts/${id}`,
      data: JSON.stringify({
        name: textName.val(),
        description: textDescription.val(),
      }),
      success: this.success,
      error: console.log,
      contentType: 'application/json',
      dataType: 'json'
    })
  }

  render() {
    let { name, buttonText, idValue="", nameValue="", descValue="" } = this.props
    return (
      <form className={name}>
        <Text
          ref="textId"
          name="id"
          value={idValue}
          label="Post ID"
          disabled={true}
          required={false} />
        <Text
          ref="textName"
          name="name"
          value={nameValue}
          label="Name"
          disabled={false}
          required={true} />
        <Text
          ref="textDescription"
          name="description"
          value={descValue}
          label="Description"
          disabled={false}
          required={true} />
        <button type="submit" onClick={this.handleClick} className="btn btn-success">
          {buttonText}
        </button>
      </form>
    )
  }
}

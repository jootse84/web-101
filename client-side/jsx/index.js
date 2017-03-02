import React from 'react'
import ReactDOM from 'react-dom'

import Title from './components/title'

ReactDOM.render(
  <Title text="Showing a bit of web dev"/>,
  document.getElementById('title') 
)

// Initialize an App variable to store the app's posts
let App = {
  posts: []
}

// Fetch all the posts from the server
let getAllPosts = () => {
  showSpinner()
  $.get('http://localhost:3000/api/posts', (posts) => {
    App.posts = posts
    refreshTable()
    hideSpinner()
  })
}

// Toggle spinner visibility
let showSpinner = () => $('.js-loading-sign').removeClass('hide')
let hideSpinner = () => $('.js-loading-sign').addClass('hide')

// Render a table row for a posts (Check the usage of ES6 template strings!)
let renderRow = (post) => {
  return `
    <tr id="post-${post.id}">
      <td>${post.id}</td>
      <td>${post.name}</td>
      <td>${post.description}</td>
      <td>
        <button
          type="button"
          class="btn btn-xs btn-success js-edit-post"
          data-id="${post.id}">
          <span class="glyphicon glyphicon glyphicon-pencil"></span>
        </button>
        <button
          type="button"
          class="btn btn-xs btn-danger js-delete-post"
          data-id="${post.id}">
          <span class="glyphicon glyphicon glyphicon-trash"></span>
        </button>
      </td>
    </tr>
  `
}

// Render the table from scratch
let refreshTable = () => {
  let tableBody = $('table.js-posts-table tbody')
  let html = ''

  for (let key in App.posts) {
    let post = App.posts[key]
    html += renderRow(post)
  }

  tableBody.html(html)
}

// Remove an specific row from the table
let removePost = (id) => {
  let row = $(`table.js-posts-table tbody #post-${id}`)
  row.fadeOut(750, () => row.remove())
}

// Store a post on the server
let createPost = () => {
  showSpinner()

  let form = $('.js-create-post-form')
  let formElement = form[0]

  let post = {
    name: $('input:nth(0)', form).val(),
    description: $('input:nth(1)', form).val()
  }

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/api/posts',
    data: JSON.stringify(post),
    success: (data, textStatus, jqXHR) => {
      post.id = jqXHR.getResponseHeader('Location').split('/').pop() // Fancy way to get the post id from the Location header
      App.posts.push(post)
      refreshTable()
      hideSpinner()
      formElement.reset()
    },
    error: console.log,
    contentType: 'application/json',
    dataType: 'json'
  });
}

// Load a post into the edit post form
let editPost = (id) => {
  let post = App.posts.filter((post) => post.id == id)[0]
  let form = $('.js-update-post-form')

  $('input[name=id]', form).val(post.id)
  $('input[name=name]', form).val(post.name)
  $('input[name=description]', form).val(post.description)

  scrollTo(form)
}

// Store the edited post in the server
let updatePost = () => {
  showSpinner()

  const id = $('.js-update-post-form input:nth(0)').val()
  let post = App.posts.filter((post) => post.id == id)[0]
  let formElement = $('.js-update-post-form')[0]

  post.name = $('.js-update-post-form input:nth(1)').val()
  post.description = $('.js-update-post-form input:nth(2)').val()

  $.ajax({
    type: 'PUT',
    url: `http://localhost:3000/api/posts/${id}`,
    data: JSON.stringify({
      name: post.name,
      description: post.description,
    }),
    success: function () {
      formElement.reset()
      hideSpinner()
      refreshTable()
    },
    error: console.log,
    contentType: 'application/json',
    dataType: 'json'
  });
}

// Delete a post from server and update table
let deletePost = (id) => {
  $.ajax({
    type: 'DELETE',
    url: `http://localhost:3000/api/posts/${id}`,
    success: removePost(id),
    error: console.log
  });
}

// Scroll window to an element
let scrollTo = (element) => {
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 300);
}

$(() => {
  // Bind all the events
  $('.js-get-posts').click((event) => {
    event.preventDefault()
    getAllPosts()
  })

  $('.js-create-post-form').submit((event) => {
    event.preventDefault()
    createPost()
  })

  $('.js-update-post-form').submit((event) => {
    event.preventDefault()
    updatePost()
  })

  $(document).on('click', '.js-delete-post', (event) => {
    event.preventDefault()
    let id = $(event.currentTarget).data('id')
    deletePost(id)
  })

  $(document).on('click', '.js-edit-post', (event) => {
    event.preventDefault()
    let id = $(event.currentTarget).data('id')
    editPost(id)
  })

  // Initialize table with data
  getAllPosts()
})

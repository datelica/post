document.addEventListener('DOMContentLoaded', function () {
  let currentPage = 1
  const limit = 5 // Limit number of posts per page

  displayUserStatus()

  fetchPosts(currentPage, limit)

  // Add event listener for like buttons
  const likeButtons = document.querySelectorAll('.like-button')

  likeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const postId = button.getAttribute('data-post-id')
      likePost(postId)
    })
  })

  // Add event listener for update buttons
  const updButtons = document.querySelectorAll('.update-button')

  updButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const postId = button.getAttribute('upd-post-id')
      updatePost(postId)
    })
  })

  // Add event listener for delete buttons
  const delButtons = document.querySelectorAll('.delete-button')

  delButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const postId = button.getAttribute('del-post-id')
      deletePost(postId)
    })
  })

  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++
    fetchPosts(currentPage, limit)
  })

  document.getElementById('prevPage').addEventListener('click', () => {
    //Decrements currentPage by 1, if the result is < 1, sets currentPage to 1.
    currentPage = Math.max(1, currentPage - 1)
    fetchPosts(currentPage, limit)
  })

  // Function to update a post
  function updatePost(postId) {
    const updatedContent = document.getElementById(
      'updatePostContent' + postId
    ).value
    const token = localStorage.getItem('token')

    fetch('http://localhost:4000/posts/' + postId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ content: updatedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Post updated:', data)
      })
      .catch((error) => console.error('Error:', error))
  }

  // Function to delete a post
  function deletePost(postId) {
    const token = localStorage.getItem('token')

    fetch('http://localhost:4000/posts/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Post deleted')
        } else {
          console.error('Error in deletion')
        }
      })
      .catch((error) => console.error('Error:', error))
  }

  // Function to like a post
  function likePost(postId) {
    const token = localStorage.getItem('token')

    fetch('http://localhost:4000/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ post_id: postId }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Post liked')
          updateLikeCount(postId)
        } else {
          console.error('Error in liking post')
        }
      })
      .catch((error) => console.error('Error:', error))
  }

  // Function to update the like count for a specific post
  function updateLikeCount(postId) {
    // Find the like count span within the specific post element
    const likeCountElement = document.querySelector(
      `button[onclick="likePost(${postId})"] .like-count`
    )
    if (likeCountElement) {
      const currentCount = parseInt(likeCountElement.textContent, 10)
      likeCountElement.textContent = isNaN(currentCount) ? 1 : currentCount + 1
    }
  }
})

// Function to get posts
function fetchPosts(page, limit) {
  fetch(`http://localhost:4000/posts?page=${page}&limit=${limit}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Response error ' + response.statusText)
      }
      return response.json()
    })
    .then((posts) => {
      displayPosts(posts)
    })
    .catch((error) => {
      console.error('Error loading Posts', error)
    })
}

// Function to display posts
function displayPosts(posts) {
  fetch('http://localhost:4000/posts')
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById('posts')
      postsContainer.innerHTML = '' // Clear existing posts
      posts.forEach((post) => {
        const postElement = document.createElement('div')
        postElement.className = 'post'
        postElement.innerHTML = `<div class="post-header">
              <span class="post-user">&#128100; ${post.username}</span>
              <span class="post-timestamp"> - ${new Date(
                post.created_at
              ).toLocaleString()}</span>
         </div>
         <div class="post-content">${post.content}</div>
         <div class="post-actions">
              <button like-post-id=${
                post.id
              })">&#10084; Like <span class="like-count">${
          post.likesCount
        }</span></button>
              <button class="update-button" upd-post-id=(${
                post.id
              })">&#9998; Update</button>
              <button class="delete-button" del-post-id=(${
                post.id
              })">&#128465; Delete</button>
         </div>`
        postsContainer.appendChild(postElement)
      })
    })
    .catch((error) => console.error('Error:', error))
}

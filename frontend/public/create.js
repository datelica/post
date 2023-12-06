document.addEventListener('DOMContentLoaded', function () {
  displayUserStatus()
})

// Function to create a new post
function createPost() {
  const content = document.getElementById('postContent').value
  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')
  fetch('http://localhost:4000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ content, username }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = '/' // Redirect to home page
    })
    .catch((error) => console.error('Error:', error))
}

// Function to register a new user //
document.addEventListener('DOMContentLoaded', function () {
  displayUserName()
})

function displayUserName() {
  const username = localStorage.getItem('username')
  const usernameDisplay = document.getElementById('userName')
  if (username && usernameDisplay) {
    usernameDisplay.textContent = 'Welcome ' + username
    //console.log(usernameDisplay)
  } else if (usernameDisplay) {
    usernameDisplay.textContent = 'Welcome guess user'
    //console.log(usernameDisplay)
  }
}

// Function to register a user
function register() {
  const username = document.getElementById('registerUsername').value
  const password = document.getElementById('registerPassword').value
  const email = document.getElementById('registerEmail').value

  fetch('http://localhost:4000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
    .then((response) => {
      response.json()
      console.log('RESPONSE....', response.json)
    })
    .then((data) => {
      console.log('DATA....', data)
      window.location.href = 'login'
    })
    .catch((error) => console.error('Error:', error))
}

// Function to log in a user
function login() {
  const username = document.getElementById('loginUsername').value
  const password = document.getElementById('loginPassword').value

  fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((response) =>
      response.json()
    .then((data) => ({ status: response.status, body: data }))
    )
    .then(({ status, body }) => {
      if (status !== 200) {
        // Display error message to user
        alert(body.message)
      } else {
        localStorage.setItem('token', body.token)
        localStorage.setItem('username', username)
        window.location.href = '/' // Redirect to home page
      }
    })
    .catch((error) => {
      console.error('Error during login:', error)
      // Optionally, handle network error (e.g., server unreachable)
    })
}

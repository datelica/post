function displayUserStatus() {
  const username = localStorage.getItem('username')
  const jwtoken = localStorage.getItem('token')
  const logInOutButton = document.createElement('a')
  const usernameDisplay = document.getElementById('userName')
  const buttonDisplay = document.getElementById('navButtons')
  if (username && usernameDisplay) {
    usernameDisplay.textContent = 'Welcome ' + username
    logInOutButton.textContent = 'Logout'
    logInOutButton.addEventListener('click', logout)
  } else if (usernameDisplay) {
    usernameDisplay.textContent = 'Welcome guess user'
    logInOutButton.href = 'login'
    logInOutButton.textContent = 'Login'
  }
  buttonDisplay.appendChild(logInOutButton)
}

// Function to logout a user
function logout() {
  // Clear local storage
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  window.location.href = '/login' // Redirect to login
}

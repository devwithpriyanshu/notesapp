import { showNotesApp } from "../../util.js";

export async function signingup(e) {
  e.preventDefault();

  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (validateSignup(username, email, password)) {
    try {
      const response = await fetch(
        'http://localhost:9000/api/v1/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Signup successful!');
        showNotesApp();
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

function validateSignup(username, email, password) {
  if (!username || !email || !password) {
    alert('All fields are required');
    return false;
  }
  if (!validateEmail(email)) {
    alert('Invalid email');
    return false;
  }
  if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return false;
  }
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


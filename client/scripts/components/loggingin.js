import { showNotesApp } from "../../util.js";

export async function loggingin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (validateLogin(email, password)) {
    try {
      const response = await fetch('http://localhost:9000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        showNotesApp();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

function validateLogin(email, password) {
  if (!email || !password) {
    alert('All fields are required');
    return false;
  }
  if (!validateEmail(email)) {
    alert('Invalid email');
    return false;
  }
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


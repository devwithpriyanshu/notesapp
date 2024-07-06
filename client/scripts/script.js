import { fetchNotes } from './api/notes/fetchNotes.js';
import { createNote } from './api/notes/createNote.js';
import { signingup } from './components/signup.js';
import { loggingin } from './components/loggingin.js';
import { showNotesApp } from '../util.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentView = 'all';

  document.getElementById('addNotebtn').addEventListener('click', createNote);
  document.getElementById('homebtn').addEventListener('click', () => {
    currentView = 'all';
    fetchNotes(currentView);
  });
  document.getElementById('archivebtn').addEventListener('click', () => {
    currentView = 'archives';
    fetchNotes(currentView);
  });
  document.getElementById('trashbtn').addEventListener('click', () => {
    currentView = 'trash';
    fetchNotes(currentView);
  });

  document.getElementById('signupForm').addEventListener('submit', signingup);

  document.getElementById('loginForm').addEventListener('submit', loggingin);

  document.getElementById('logoutbtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logout successful!');
    document.getElementById('auth').style.display = 'block';
    document.getElementById('notesApp').style.display = 'none';
  });

  const token = localStorage.getItem('token');
  if (token) {
    showNotesApp();
    fetchNotes(currentView);
  }
});

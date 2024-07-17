import { fetchNotes } from './api/notes/fetchNotes.js';
import { createNote } from './api/notes/createNote.js';
import { signingup } from './components/signup.js';
import { loggingin } from './components/login.js';
import { displayLabels, showNotesApp } from './util.js';
import { searchNotes } from './api/notes/searchNotes.js';
import { Dropdown } from "https://cdn.jsdelivr.net/npm/jolty@0.6.2/dist/jolty.esm.min.js";

Dropdown.initAll();

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
    document.getElementById('auth').style.display = 'flex';
    document.getElementById('notesApp').style.display = 'none';
  });
  document.getElementById('searchbtn').addEventListener('click',searchNotes);

  const token = localStorage.getItem('token');
  if (token) {
    fetchNotes(currentView);
    displayLabels();
    showNotesApp();
  }
});

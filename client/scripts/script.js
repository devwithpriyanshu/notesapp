import { fetchNotes } from './api/notes/fetchNotes.js';
import { createNote } from './api/notes/createNote.js';


document.addEventListener('DOMContentLoaded', () => {

  const addNotebtn = document.getElementById('addNotebtn');
  const archivebtn = document.getElementById('archivebtn');
  const homebtn = document.getElementById('homebtn');


  let currentView = 'unarchived';
  fetchNotes(currentView);

  addNotebtn.addEventListener('click', createNote);
  homebtn.addEventListener('click', () => {
    currentView = 'unarchived';
    fetchNotes(currentView);
  });
  archivebtn.addEventListener('click', () => {
    currentView = 'archived';
    fetchNotes(currentView);
  });




});

import { renderSingleNote } from '../../components/rendernote.js';

export function fetchNotes(currentView) {
  const notesList = document.getElementById('notesList');
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found');
    return;
  }
  fetch(
    `http://localhost:9000/api/v1/notes/${
      currentView === 'archived' ? 'archives' : 'all'
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((notes) => {
      notesList.innerHTML = '';
      notes.forEach((note) => {
        const singleNote = renderSingleNote(note);
        if (notesList) notesList.appendChild(singleNote);
      });
    })
    .catch((error) => console.error('Error:', error));
}

import { fetchNotes } from "./fetchNotes.js";

export function createNote() {
  const notesList = document.getElementById('notesList');
  const titleInput = document.getElementById('titleInput');
  const contentInput = document.getElementById('contentInput');

  const token = localStorage.getItem('token');
  const titleValue = titleInput.value;
  const contentValue = contentInput.value;
  if (!token) {
    console.error('No token found');
    return;
  }
  fetch('http://localhost:9000/api/v1/notes/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: titleValue, content: contentValue }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
        notesList.innerHTML = '';

        fetchNotes('unarchived');

    })
    .catch((error) => console.error('Error:', error));
}

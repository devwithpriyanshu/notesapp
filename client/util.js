import { fetchNotes } from './scripts/api/notes/fetchNotes.js';

export function toggleEdit(noteElement, isEditing) {
  const title = noteElement.querySelector('.note-title');
  const label = noteElement.querySelector('.note-label');
  const content = noteElement.querySelector('.note-content');
  const bgColor = noteElement.querySelector('.note-bg-color');
  const saveBtn = noteElement.querySelector('.savebtn');
  const editBtn = noteElement.querySelector('.editbtn');

  title.contentEditable = isEditing;
  label.contentEditable = isEditing;
  content.contentEditable = isEditing;
  bgColor.hidden = !isEditing;

  saveBtn.hidden = !isEditing;
  editBtn.hidden = isEditing;

  if (isEditing) {
    title.focus();
  }
}

export function saveNoteChanges(noteElement, note, archived) {
  const title = noteElement.querySelector('.note-title').innerText;
  const label = noteElement.querySelector('.note-label').innerText;
  const content = noteElement.querySelector('.note-content').innerText;
  const bgColor = noteElement.querySelector('.note-bg-color').value;
  const saveBtn = noteElement.querySelector('.savebtn');
  const editBtn = noteElement.querySelector('.editbtn');

  const updatedNote = {
    ...note,
    title,
    label,
    content,
    backgroundColor: bgColor,
  };

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = 'Saving...';

  fetch('http://localhost:9000/api/v1/notes/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedNote),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      toggleEdit(noteElement, false);
      notesList.innerHTML = '';

      fetchNotes(archived ? 'archives' : 'all');
    })
    .catch((error) => {
      console.error('Error:', error);
    })
    .finally(() => {
      saveBtn.innerText = 'Save';
      saveBtn.disabled = false;
    });
}

export function toggleArchive(note, archived) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }
  fetch('http://localhost:9000/api/v1/notes/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id: note._id, isArchived: !archived }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      notesList.innerHTML = '';

      fetchNotes(archived ? 'archives' : 'all');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export function toggleDelete(note, trashed) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }
  fetch(`http://localhost:9000/api/v1/notes/${trashed ? 'restore':'delete'}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id: note._id}),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      notesList.innerHTML = '';

      fetchNotes(trashed ? 'trash' : 'all');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export function showNotesApp() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('notesApp').style.display = 'contents';
}

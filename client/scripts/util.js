import { fetchNotes } from './api/notes/fetchNotes.js';
import { renderSingleNote } from './components/rendernote.js';

export function toggleEdit(noteElement, isEditing) {
  const title = noteElement.querySelector('.note-title');
  const content = noteElement.querySelector('.note-content');
  const bgColor = noteElement.querySelector('.note-bg-color');
  const saveBtn = noteElement.querySelector('.savebtn');
  const editBtn = noteElement.querySelector('.editbtn');

  title.contentEditable = isEditing;
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
  const content = noteElement.querySelector('.note-content').innerText;
  const bgColor = noteElement.querySelector('.note-bg-color').value;
  const saveBtn = noteElement.querySelector('.savebtn');
  const editBtn = noteElement.querySelector('.editbtn');

  const updatedNote = {
    ...note,
    title,
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
  fetch(
    `http://localhost:9000/api/v1/notes/${trashed ? 'restore' : 'delete'}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: note._id }),
    }
  )
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

export async function populateDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.style.display =
    dropdownMenu.style.display === 'relative' ? 'none' : 'relative';
  dropdownMenu.innerHTML = '';

  const response = await fetch('http://localhost:9000/api/v1/labels/all', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (response.ok) {
    const labels = await response.json();

    labels.forEach((label) => {
      const labelCheckbox = document.createElement('div');
      labelCheckbox.className = 'dropdown-item';
      labelCheckbox.innerHTML = `
      <input type="checkbox" value="${label._id}">
      <span>${label.name}</span>
      `;
      dropdownMenu.appendChild(labelCheckbox);
    });
  }

  // // Add input field and button for creating a new label
  const newLabelDiv = document.createElement('div');
  newLabelDiv.className = 'dropdown-item';
  newLabelDiv.innerHTML = `
      <input type="text" id="newLabelName" placeholder="Create Label">
      <div class="divider"></div>
      <button id="addNewLabelButton">Add</button>
    `;
  dropdownMenu.appendChild(newLabelDiv);

  // Add event listener for the "Add" button
  document
    .getElementById('addNewLabelButton')
    .addEventListener('click', async () => {
      const newLabelName = document.getElementById('newLabelName').value;
      try {
        const response = await fetch(
          'http://localhost:9000/api/v1/labels/add',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newLabelName,
            }),
          }
        );
        if (response.ok) {
          const label = await response.json();
          const labelCheckbox = document.createElement('div');
          labelCheckbox.className = 'dropdown-item';
          labelCheckbox.innerHTML = `
                <input type="checkbox" value="${label._id}">
                <span>${label.name}</span>
                `;
          dropdownMenu.insertBefore(labelCheckbox, dropdownMenu.lastChild);
        }
      } catch (error) {
        console.log(error);
      }
    });
}

async function fetchLabels() {
  try {
    const response = await fetch('http://localhost:9000/api/v1/labels/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const labels = await response.json();
      return labels;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


export async function displayLabels() {
  const labelsContainer = document.getElementById('labels');
  labelsContainer.innerHTML = '';
  try {
    const response = await fetch('http://localhost:9000/api/v1/labels/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const labels = await response.json();
      labels.forEach((label) => {
        const labelDiv = document.createElement('li');
        labelDiv.className = 'label';
        labelDiv.innerText = `${label.name}`;
        labelDiv.addEventListener('click', () => filterNotesByLabel(label._id));
        labelsContainer.appendChild(labelDiv);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function handleDropdownToggle() {
  const dropdown = document.querySelector('.dropdown');
  dropdown.hidden = !dropdown.hidden;
  if (!dropdown.hidden) {
    const labels = await fetchLabels();
    renderLabels(labels, dropdown, note);
  }
}

async function filterNotesByLabel(labelId) {
  try {
    const response = await fetch(`http://localhost:9000/api/v1/notes/${labelId}/allnotes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const notes = await response.json();
      notesList.innerHTML = '';
      notes.forEach( (note) => {
        const singleNote = renderSingleNote(note);
        if (notesList) notesList.appendChild(singleNote);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

let token = '';

const loginBtn = document.getElementById('login').addEventListener('onclick', login)


function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        token = data.token;
        document.getElementById('auth').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadNotes();
    })
    .catch(error => console.error('Error:', error));
}

function createNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(note => {
        loadNotes();
    })
    .catch(error => console.error('Error:', error));
}

function loadNotes() {
    fetch('/api/notes', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(notes => {
        const notesDiv = document.getElementById('notes');
        notesDiv.innerHTML = '';
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.textContent = `${note.title}: ${note.content}`;
            notesDiv.appendChild(noteDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}

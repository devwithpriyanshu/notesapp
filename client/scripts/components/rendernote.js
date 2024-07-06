import { toggleEdit, saveNoteChanges, toggleArchive } from "../../util.js";

export function renderSingleNote(note) {
    const singleNote = document.createElement('li');
    singleNote.classList.add('note');
    singleNote.style.backgroundColor = note.backgroundColor;

    singleNote.innerHTML = `
        <h4 contenteditable="false" class="note-title">${note.title ? note.title : 'Add title'}</h4>
        <h5 contenteditable="false" class="note-label">${note.label ? note.label : ''}</h5>
        <p contenteditable="false" class="note-content">${note.content ? note.content : ''}</p>
        <div class="note-btns">
        <input type="color" class="note-bg-color" value="${note.backgroundColor}"  hidden>
            <button class="editbtn">Edit</button>
            <button class="savebtn" hidden>Save</button>
            <button class="archivebtn">${note.isArchived ? 'Unarchive': 'Archive'}</button>
            <button class="deletebtn">Delete</button>
        </div>
    `;

    singleNote.querySelector('.editbtn').addEventListener('click', () => toggleEdit(singleNote, true));
    singleNote.querySelector('.savebtn').addEventListener('click', () => saveNoteChanges(singleNote, note, note.isArchived));
    singleNote.querySelector('.archivebtn').addEventListener('click', () => toggleArchive(singleNote, note, note.isArchived));

    const colorInput = singleNote.querySelector('.note-bg-color');
    colorInput.addEventListener('input', (event) => {
        const newColor = event.target.value;
        singleNote.style.backgroundColor = newColor;
        note.backgroundColor = newColor;
    });

    return singleNote;
}

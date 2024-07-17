import { renderSingleNote } from '../../components/rendernote.js';

export async function searchNotes() {
  const query = document.getElementById('searchInput').value.trim();
  console.log(query)
  const notesList = document.getElementById('notesList');
    const token = localStorage.getItem('token')
  if (query && token) {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/notes/search/${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const notes = await response.json();

        if (notes.length > 0) {
          notesList.innerHTML = '';
          notes.forEach((note) => {
            const singleNote = renderSingleNote(note);
            if (notesList) notesList.appendChild(singleNote);
          });
        } else {
          notesList.innerHTML = '<p>No notes found</p>';
        }
      }
      //   else {
      //     notesList.innerHTML = '<p>Error searching notes</p>';
      //   }
    } catch (err) {
      notesList.innerHTML = '<p>Error searching notes</p>';
    }
  }
}

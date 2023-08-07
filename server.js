const express = require('express');
const path = require('path');
const fs = require('fs');

// create instance of express
const app = express();

// Set up middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define routes to handle requests and for the server
// create html route for index.html and notes.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

const dbFilePath = path.join(__dirname, 'db.json');

// create api route to get all notes from data from db.json and return as JSON
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const newNote = req.body;
  newNote.id = generateUniqueId();
  notes.push(newNote);
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const noteId = req.params.id;
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync(dbFilePath, JSON.stringify(updatedNotes));
  res.sendStatus(204);
});

// connect back end to front end
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  })
  .catch((error) => {
    console.error('Error saving note:', error);
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  })
  .catch((error) => {
    console.error('Error deleting note:', error);
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const generateUniqueId = () => {
  // Generate a unique ID for the note
  // You can use libraries like uuid or shortid for this purpose
  // Example: const uuid = require('uuid');
  //          const id = uuid.v4();
  // For simplicity, let's assume generateUniqueId() returns a unique string
  // Implement your own logic for generating unique IDs if needed
  return 'unique-id';
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
const express = require('express');
const path = require('path');
const fs = require('fs');

// create instance of express
const app = express();

// Set up middleware
app.use('/assets', express.static('assets'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let activeNote = {};

async function fetchNotes() {
  try {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

async function saveNoteToServer(note) {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    const savedNote = await response.json();
    return savedNote;
  } catch (error) {
    console.error('Error saving note:', error);
    return null;
  }
}

async function deleteNoteFromServer(noteId) {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}

function createNoteCard(note) {
  const noteCard = document.createElement('div');
  noteCard.classList.add('note-card');

  const titleElement = document.createElement('h2');
  titleElement.textContent = note.title;

  const textElement = document.createElement('p');
  textElement.textContent = note.text;

  noteCard.appendChild(titleElement);
  noteCard.appendChild(textElement);

  noteCard.addEventListener('click', handleNoteView);

  return noteCard;
}

function renderNotes(notes) {
  const notesContainer = document.querySelector('.notes');
  notesContainer.innerHTML = '';

  notes.forEach((note) => {
    const noteCard = createNoteCard(note);
    noteCard.setAttribute('data-note', JSON.stringify(note));
    notesContainer.appendChild(noteCard);
  });
}

function renderActiveNote() {
  const titleElement = document.getElementById('note-title');
  const textElement = document.getElementById('note-text');

  titleElement.value = activeNote.title || '';
  textElement.value = activeNote.text || '';
}

async function handleNoteFormSubmit(event) {
  event.preventDefault();

  const noteTitle = document.getElementById('note-title').value;
  const noteText = document.getElementById('note-text').value;

  if (noteTitle.trim() === '' || noteText.trim() === '') {
    alert('Please enter both title and text for the note.');
    return;
  }

  const newNote = {
    title: noteTitle,
    text: noteText,
  }
  };

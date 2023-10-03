const PORT = process.env.PORT || 3001;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


let everyNote = require("./db/db.json");

// Use a middleware function to set common headers for all routes
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});


app.get("/api/notes", (req, res) => {
  res.json(everyNote);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function createNote(body) {
  const note = body;
  if (!Array.isArray(everyNote)) {
    everyNote = [];
  }

  if (everyNote.length === 0) {
    everyNote.push({ id: 0 });
  }

  body.id = everyNote[0].id;
  everyNote[0].id++;

  everyNote.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(everyNote, null, 2)
  );
  return note;
}

app.post("/api/notes", (req, res) => {
  const note = createNote(req.body);
  res.json(note);
});

app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});

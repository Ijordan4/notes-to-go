const PORT = process.env.PORT || 3001;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const everyNote = require("./db/db.json");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
    res.json(everyNote.slice(1));
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

function createNote (body, noteArr) {
    const note = body;
    if(!Array.isArray(noteArr)) {
        noteArr = [];
    };

    if(noteArr.length === 0) {
        noteArr.push(0);
    };

    body.id = noteArr[0];
    noteArr[0]++;

    noteArr.push(note);
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(noteArr, null, 2)
    );
    return note;
};

app.post("/api/notes", (req, res) => {
    const note = createNote(req.body, everyNote);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`Server available at localhost ${PORT}`);
});

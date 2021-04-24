const express = require("express");
const morgan = require("morgan");
const { render } = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const Note = require("./models/notes");

const app = express();
const PORT = process.env.PORT || 3000;

// db connection
const db_connect = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@notescluster.f21hb.mongodb.net/notesDB?retryWrites=true&w=majority`;

mongoose
    .connect(db_connect, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then((result) => {
        app.listen(PORT, () => {
            console.log("Server listening on", PORT);
        });
    })
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
// middleware
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/notes");
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});

// create notes
app.get("/notes/create", (req, res) => {
    res.render("create", { title: "Create New Note" });
});

app.get("/notes", (req, res) => {
    Note.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            res.render("index", {
                title: "Home",
                notes: result,
            });

            // res.send(result);
        })
        .catch((err) => console.log(err));
});

app.post("/notes", (req, res) => {
    const note = new Note(req.body);
    note.save()
        .then((result) => {
            res.redirect("/");
        })
        .catch((err) => console.log(err));
});

app.get("/notes/:id", (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then((result) => {
            // the return result is the single note found
            res.render("details", {
                title: "Note Details",
                note: result,
            });
        })
        .catch((err) => console.log(err));
});

// for error page
app.use((req, res) => {
    res.status(404).render("404", { title: "page not found" });
});

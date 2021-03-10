const express = require("express");
const morgan = require("morgan");
const { render } = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const Note = require("./models/notes");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");

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

// middleware
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
    Note.find()
        .then((notes) => {
            res.render("index", { title: "Home", notes });
        })
        .catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});

// create notes
app.get("/notes/create", (req, res) => {
    const notes = new Note({
        title: "Tongue beyond the upper room",
        author: "James",
        body:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, facilis nisi possimus reiciendis hic perspiciatis error labore accusamus odio. Doloremque quo id deserunt sequi labore tenetur sunt accusamus incidunt aperiam.",
    });
    notes
        .save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
    // res.render("create", { title: "Create New Note" });
});

// for error page
app.use((req, res) => {
    res.status(404).render("404", { title: "page not found" });
});

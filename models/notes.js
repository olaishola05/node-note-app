const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },

        snippet: {
            type: String,
            required: true,
            unique: true,
        },

        author: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },
    },

    { timestamps: true }
);

// note model
const Note = mongoose.model("Note", noteSchema);
module.exports = Note;

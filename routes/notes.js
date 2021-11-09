const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes');

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
})

router.post('/addnote', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const note = new Notes({ title, description, tag, user: req.user.id });
        const savedNote = await note.save();
        res.json({ savedNote: savedNote });
    } catch (error) {
        res.json({ errors: "some error occurred!" });
    }
})

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = { title: title, description: description, tag: tag };

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

        res.json({ note });
    } catch (error) {
        console.log(error)
        res.json({ errors: "some error occurred!" });
    }
})

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ msg: "note deleted", note });

    } catch (error) {
        console.log(error)
        res.json({ errors: "some error occurred!" });
    }
})

module.exports = router;
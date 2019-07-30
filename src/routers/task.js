const express = require('express');
const router = new express.Router();
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js');



//create 
router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send('Error: ' + error);
    }
});

//read all
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=2
//GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    try {

        const match = {}
        const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

//read one
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findById(req.params.id);

        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send('Task not found. 404');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

//update
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidator = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidator) {
        return res.status(400).send({ error: 'Invalid Update!' });
    }

    try {
        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);

    } catch (error) {
        res.status(400).send(error);
    }
});

//delete
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });


        if (!task) {
            return res.status(404).send('Invalid deletion!');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
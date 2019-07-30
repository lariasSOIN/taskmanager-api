const mongoose =  require('mongoose');
const validator = require('validator');

//model
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    },
    //asocia las tareas con usuarios
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
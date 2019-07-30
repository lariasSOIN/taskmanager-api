require('../src/db/mongoose.js');
const Task = require('../src/models/task.js');



// Task.findByIdAndDelete('5d3868a0780d40ff8429740e').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
// }).then((conunter) => {
//     console.log(conunter);
// }).catch((e) => {
//  console.log(e);
// });

const deleteTaskAndCount = async (id, completed) => {
    const task = await Task.findByIdAndDelete(id);
    const counter = await Task.countDocuments({ completed });
    return counter;
}

deleteTaskAndCount('5d386937957a44ffb535480d', false).then((counter) => {
    console.log(counter);
}).catch((e) => {
    console.log(e);
});


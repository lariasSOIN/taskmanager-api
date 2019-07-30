require('../src/db/mongoose.js');
const User = require('../src/models/user.js');


// User.findByIdAndUpdate('5d3864570d4b26fed196c34a', { age: 20 } ).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 20 });
// }).then((number) => {
//     console.log(number);
// }).catch((er) => {
//     console.log(er);
// });

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const counter = await User.countDocuments({ age });
    return counter
}

updateAgeAndCount('5d3864570d4b26fed196c34a', 15 ).then((counter) => {
    console.log(counter);
}).catch((e) => {
    console.log(e);
})
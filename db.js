const mongoose = require('mongoose')
const connect= ()=>{
    mongoose.connect('mongodb://localhost:27017/akasa',{

    }).then(()=>{console.log('DB connected')
    }).catch((err)=>{console.log(err)})
}

module.exports = connect
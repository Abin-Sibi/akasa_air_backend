const mongoose = require('mongoose')
const connect= ()=>{
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{console.log('DB connected')
    }).catch((err)=>{console.log(err)})
}

module.exports = connect
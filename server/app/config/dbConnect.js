const mongoose = require('mongoose');
const mongoDB ="mongodb://localhost:27017/chat_rooms?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected')).catch(err => console.log(err))
module.exports = mongoose;
const mongoose = require('mongoose');


const mongoURL = 'mongodb://127.0.0.1:27017/todo_app';


mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

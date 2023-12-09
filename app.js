const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// MongoDB connection setup (as per your db.js file)
const mongoURL = 'mongodb+srv://srinivaschiyyedu7816:admin123@cluster0.dkjpt1q.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const User = mongoose.model('User', {
  username: String,
  password: String,
});

const Task = mongoose.model('Task', {
  title: String,
  description: String,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/auth/register', async (req, res) => {
  console.log('Received data:', req.body);
  try {
    const newUser = await User.create(req.body);
    console.log('New user created:', newUser);
    return res.redirect("/auth/login");
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('Internal Server Error');
  }
});




app.get('/auth/login', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.redirect("/tasks")
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  const acceptHeader = req.get('Accept');

  if (acceptHeader && acceptHeader.includes('text/html')) {
    res.sendFile(path.join(__dirname, 'public', 'tasks.html'));
  } else {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task', error.message);
    res.status(500).json({ error: 'Error adding task. Please try again.' });
  }
});

app.get('/tasks/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edittask.html'));
});




app.put('/tasks/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

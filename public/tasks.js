document.addEventListener('DOMContentLoaded', async () => {
  const addTaskForm = document.getElementById('addTaskForm');
  const taskList = document.getElementById('taskList');

  
  const fetchAndDisplayTasks = async () => {
    try {
      
      taskList.innerHTML = '';

      const response = await fetch('/tasks');
      const tasks = await response.json();

      tasks.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'list-group-item';
        taskItem.textContent = `${task.title}: ${task.description}`;

        
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm mx-1';
        editButton.textContent = 'Edit';
        
        editButton.addEventListener('click', () => handleEditTask(task._id));

        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => handleDeleteTask(task._id));

        
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);

        
        taskList.appendChild(taskItem);
      });
    } catch (error) {
      console.error('Error fetching tasks', error.message);
      
    }
  };

  
  fetchAndDisplayTasks();

  
  addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
        }),
      });

      const newTask = await response.json();

      
      alert('Task added successfully!');

      
      fetchAndDisplayTasks();

      
      addTaskForm.reset();

    } catch (error) {
      console.error('Error adding task', error.message);
      
      alert('Error adding task. Please try again.');
    }
  });

  
  const handleEditTask = (taskId) => {
    window.location.href = `/tasks/edit/${taskId}`;
  };
  

  
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log(result.message);

      
      fetchAndDisplayTasks();
    } catch (error) {
      console.error('Error deleting task', error.message);
      
      alert('Error deleting task. Please try again.');
    }
  };
});

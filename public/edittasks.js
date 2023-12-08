console.log('Task ID:');
document.addEventListener('DOMContentLoaded', async () => {
  const editTaskForm = document.getElementById('editTaskForm');
  const saveChangesButton = document.querySelector('#editTaskForm button[type="button"]');
  const taskId = getTaskIdFromUrl();
  console.log('Task ID:', taskId);
 

  saveChangesButton.addEventListener('click', submitEditTaskForm);

  async function fetchTaskDetails(taskId) {
    try {
      const response = await fetch(`/tasks/${taskId}`);
      const taskDetails = await response.json();
      return taskDetails;
    } catch (error) {
      console.error('Error fetching task details', error.message);
      alert('Error fetching task details. Please try again.');
    }
  }

  function populateEditForm(taskDetails) {
    document.getElementById('editTaskId').value = taskDetails._id;
    document.getElementById('editTaskTitle').value = taskDetails.title;
    document.getElementById('editTaskDescription').value = taskDetails.description;
  }

  async function submitEditTaskForm() {
    console.log('submitEditTaskForm function called'); 
    const editedTitle = document.getElementById('editTaskTitle').value;
    const editedDescription = document.getElementById('editTaskDescription').value;

    try {
      const response = await fetch(`/tasks/${taskId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      const updatedTask = await response.json();
      console.log('Updated Task:', updatedTask);

      alert('Task updated successfully!');

      window.location.href = '/tasks';
    } catch (error) {
      console.error('Error editing task', error.message);
      alert('Error editing task. Please try again.');
    }
  }

  const taskDetails = await fetchTaskDetails(taskId);
  populateEditForm(taskDetails);
});

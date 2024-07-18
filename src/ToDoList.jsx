import React, { useState, useEffect } from "react";
import add from "./assets/icons/addIcon.png";
import edit from "./assets/icons/icons8-edit.svg";
import deletes from "./assets/icons/icons8-delete.svg";
import tick from "./assets/icons/icons8-tick.svg";
function ToDoList() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskExpiry, setNewTaskExpiry] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [editedTaskExpiry, setEditedTaskExpiry] = useState("");
  const [repeatOption, setRepeatOption] = useState("none");
  const [incompleteTasksCount, setIncompleteTasksCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTasksCount();
  }, [tasks]);

  useEffect(() => {
    const taskNotifications = tasks.map((task, index) => {
      const timeUntilExpiry = task.expiry - Date.now();
      if (timeUntilExpiry > 0) {
        return setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification(`Task "${task.description}" is due now!`);
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification(`Task "${task.description}" is due now!`);
              }
            });
          }
        }, timeUntilExpiry);
      }
      return null;
    });

    return () => {
      taskNotifications.forEach((notification) => clearTimeout(notification));
    };
  }, [tasks]);

  function updateTasksCount() {
    setIncompleteTasksCount(tasks.length);
  }

  function handleDescriptionChange(event) {
    setNewTaskDescription(event.target.value);
  }

  function handleExpiryChange(event) {
    setNewTaskExpiry(event.target.value);
  }

  function handleRepeatChange(event) {
    setRepeatOption(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addNewTask();
    }
  }

  function addNewTask() {
    if (newTaskDescription.trim() !== "") {
      let newTaskExpiryValue = ""; // Initialize with empty value
      // Check if repeat option is set to 'none', then require the date
      if (repeatOption === "none") {
        // Only add task if both description and expiry are provided
        if (newTaskExpiry.trim() === "") {
          alert("Please select a valid expiry date for the task.");
          return;
        }
        newTaskExpiryValue = new Date(newTaskExpiry).getTime();
      } else {
        // If repeat option is set, only consider the time without the date
        const currentTime = new Date();
        const selectedTime = new Date(newTaskExpiry);
        currentTime.setHours(selectedTime.getHours());
        currentTime.setMinutes(selectedTime.getMinutes());
        newTaskExpiryValue = currentTime.getTime();
      }

      const newTask = {
        description: newTaskDescription,
        expiry: newTaskExpiryValue,
        repeat: repeatOption,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskDescription("");
      setNewTaskExpiry("");
      setRepeatOption("none");
    } else {
      alert("Please enter a task description.");
    }
  }

  function deleteTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setEditingIndex(-1);
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setEditedTaskDescription(tasks[index].description);
    setEditedTaskExpiry(
      new Date(tasks[index].expiry).toISOString().slice(0, -1)
    );
  }

  function handleSaveEdit(index) {
    if (editedTaskDescription.trim() !== "" && editedTaskExpiry.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[index].description = editedTaskDescription;
      updatedTasks[index].expiry = new Date(editedTaskExpiry).getTime();
      updatedTasks[index].repeat = repeatOption;
      setTasks(updatedTasks);
      setEditingIndex(-1);
      setEditedTaskDescription("");
      setEditedTaskExpiry("");
    }
  }

  function handleCancelEdit() {
    setEditingIndex(-1);
    setEditedTaskDescription("");
    setEditedTaskExpiry("");
  }

  // Function to convert time from 24-hour to 12-hour format
  function formatTime(timeString) {
    const time = new Date(timeString);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  }

  function toggleTaskCompletion(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  return (
    <main>
      <div className="heading font-">To-Do List</div>
      <div className="topInputdiv">
        <input
          className="taskInput"
          type="text"
          value={newTaskDescription}
          onChange={handleDescriptionChange}
          placeholder="Task Description"
          onKeyPress={handleKeyPress}
        />

        <button className="addTaskButton" onClick={addNewTask}>
          <img src={add}></img>
        </button>
      </div>
      {repeatOption === "none" && (
        <input
          className="dateAndTime"
          type="datetime-local"
          value={newTaskExpiry}
          onChange={handleExpiryChange}
        />
      )}

      <select
        className="repeatedTasks"
        value={repeatOption}
        onChange={handleRepeatChange}
      >
        <option value="none">Do not repeat</option>
        <option value="daily">Repeat daily</option>
        <option value="monthly">Repeat monthly</option>
        <option value="monday">Repeat on Monday</option>
        <option value="tuesday">Repeat on Tuesday</option>
        <option value="wednesday">Repeat on Wednesday</option>
        <option value="thursday">Repeat on Thursday</option>
        <option value="friday">Repeat on Friday</option>
        <option value="saturday">Repeat on Saturday</option>
        <option value="sunday">Repeat on Sunday</option>
      </select>

      {/* <div>
        Incomplete Tasks: {incompleteTasksCount}
      </div> */}

      <ol>
        {tasks.map((task, index) => (
          <li
            className="tasksAdded"
            key={index}
            style={{
              backgroundColor: "inherit",
            }}
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTaskDescription}
                  onChange={(e) => setEditedTaskDescription(e.target.value)}
                />

                {repeatOption === "none" && (
                  <input
                    type="datetime-local"
                    value={editedTaskExpiry}
                    onChange={(e) => setEditedTaskExpiry(e.target.value)}
                  />
                )}
                <button onClick={() => handleSaveEdit(index)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className="finalTask"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.description}
                </span>

                <span className="repeatEvent"> {task.repeat}</span>
                <span className="time"> {formatTime(task.expiry)}</span>
                <button
                  className="editButton"
                  onClick={() => handleEdit(index)}
                >
                  <img src={edit}></img>
                </button>
                <div className="buttons">
                  <button onClick={() => deleteTask(index)}>
                    <img src={deletes}></img>
                  </button>
                  <button onClick={() => toggleTaskCompletion(index)}>
                    {task.completed ? "UNDO" : <img src={tick}></img>}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}

export default ToDoList;

// import { list } from "postcss";
import React, { useEffect, useState } from "react";

function ToDOList() {
  const [task, useTask] = useState(["one", "two", "three"]);
  const [setTask, addTask] = useState("");

  function handleOnChange(event) {
    addTask(event.target.value);
  }
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addNewTask();
    }
  }
  function addNewTask() {
    if (setTask.trim() !== "") useTask((t) => [...t, setTask]);
    addTask("");
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTask = [...task];
      [updatedTask[index], updatedTask[index - 1]] = [
        updatedTask[index - 1],
        updatedTask[index],
      ];
      useTask(updatedTask);
    }
  }
  function moveTaskDown(index) {
    if (index < task.length - 1) {
      const updatedTask = [...task];
      [updatedTask[index], updatedTask[index + 1]] = [
        updatedTask[index + 1],
        updatedTask[index],
      ];
      useTask(updatedTask);
    }
  }
  function deleteTask(index) {
    const updatedTask = task.filter((_, i) => i !== index);
    useTask(updatedTask);
  }

  
    const color = {
        backgroundColor:"blue",
        color:'white'
    }
  
 
  return (
    <>
      <div className="heading">To-Do-List</div>
      <input
        type="text"
        value={setTask}
        onChange={handleOnChange}
        onKeyPress={handleKeyPress}
      />

      <button className="addButton" onClick={addNewTask}>add</button>

      <ol className="tasksMain">
        {task.map((tasks, index) => (
          <li key={index}>
            <span>{tasks}</span>
            <div className="btns flex justify-between text-white">
                <button className="complete bg-black"onClick={color}>completed</button>
            <button className="moveUpButton    bg-black " onClick={() => moveTaskUp(index)}>up</button>
            <button className="moveDownButton   bg-black" onClick={() => moveTaskDown(index)}>down</button>
            <button className="deleteButton    bg-black " onClick={() => deleteTask(index)}>delete</button>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

export default ToDOList;

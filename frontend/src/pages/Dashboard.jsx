import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/tasks", newTask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewTask({ title: "", description: "", dueDate: "" });
    fetchTasks();
  };

  const getDateStatus = (dueDate, status) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 3600 * 24));

    if (status === "completed") return "Completed";
    if (diff < -5) return `Overdue by ${-diff} days (Severe)`;
    if (diff < 0) return `Overdue by ${-diff} days`;
    return `Due in ${diff} days`;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Tasks</h2>
      <div className="add-task">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <em>{getDateStatus(task.dueDate, task.status)}</em>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

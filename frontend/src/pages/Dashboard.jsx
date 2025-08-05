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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/tasks/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios.post("http://localhost:5000/tasks", newTask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewTask({ title: "", description: "", dueDate: "" });
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to update status");
      }
    }
  };

  const handleEditDescription = async (taskId, currentDescription) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const newDescription = prompt("Enter new description", currentDescription);
    if (newDescription) {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    }
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

  const isOverdueBy5Days = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return diffDays >= 5 && status !== "completed";
  };

  useEffect(() => {
    const tokenExists = !!localStorage.getItem("token");
    setIsLoggedIn(tokenExists);
    if (tokenExists) {
      fetchTasks();
    }
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
          disabled={!isLoggedIn}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          disabled={!isLoggedIn}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          disabled={!isLoggedIn}
        />
        <button onClick={handleAddTask} disabled={!isLoggedIn}>
          Add Task
        </button>
      </div>
      <ul className="task-list">
        {(!isLoggedIn || tasks.length === 0) && (
          <p className="no-tasks">No tasks found</p>
        )}
        {isLoggedIn &&
          tasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${
                task.status === "completed" ? "completed" : ""
              } ${
                isOverdueBy5Days(task.dueDate, task.status)
                  ? "overdue-5-days"
                  : ""
              }`}
            >
              <div className="task-details">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p className="task-status-text">
                  {getDateStatus(task.dueDate, task.status)}
                </p>
              </div>

              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                disabled={!isLoggedIn}
                style={{
                  backgroundColor: "#3b3b4a",
                  color: "#e0e0e0",
                  border: "1px solid #5a5a6a",
                  borderRadius: "4px",
                  padding: "0.4rem",
                }}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() =>
                  handleEditDescription(task._id, task.description)
                }
                disabled={!isLoggedIn}
              >
                Edit
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;

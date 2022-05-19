import React from "react";
import "./Column.scss";
import Task from "components/Task/Task";
const Column = () => {
  return (
    <div className="column">
      <header>todo list</header>
      <ul className="task-list">
        <Task />
        <li className="task-item">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </li>
        <li className="task-item">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </li>
        <li className="task-item">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </li>
        <li className="task-item">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </li>
      </ul>
      <footer>Add another card</footer>
    </div>
  );
};

export default Column;

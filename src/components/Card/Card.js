import React from "react";
import "./Card.scss";
const Card = (props) => {
  const { card } = props;
  return (
    <li className="card-item">
      {card.cover && (
        <img src={card.cover} className="card-cover" alt="trello-adam-app" />
      )}
      {card.title}
    </li>
  );
};

export default Card;

import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";

import "./BoardContent.scss";

import Column from "components/Column/Column";
import { mapOrder } from "utilities/sorts";

import { initialData } from "actions/initialData";
const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      // sort columns

      // boardFromDB.columns.sort(function (a, b) {
      //   return (
      //     boardFromDB.columnOrder.indexOf(a.id) -
      //     boardFromDB.columnOrder.indexOf(b.id)
      //   );
      // });
      // setColumns(boardFromDB.columns);
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="notfound">Board not found</div>;
  }
  return (
    <div className="board-content">
      {columns.map((column, idx) => {
        return <Column key={idx} column={column} />;
      })}
    </div>
  );
};

export default BoardContent;

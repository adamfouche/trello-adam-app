import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

import { isEmpty } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOrder } from 'utilities/sorts';

import { initialData } from 'actions/initialData';

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
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
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className='notfound'>Board not found</div>;
  }
  const onColumnDrop = (dropResult) => {
    // console.log(dropResult);
  };
  return (
    <div className='board-content'>
      <Container
        orientation='horizontal'
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector='.column-drag-handle'
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, idx) => {
          return (
            <Draggable key={idx}>
              <Column column={column} />
            </Draggable>
          );
        })}
      </Container>
    </div>
  );
};

export default BoardContent;

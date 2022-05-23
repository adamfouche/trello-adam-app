import React, { useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'

import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'

const BoardContent = () => {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    )
    if (boardFromDB) {
      setBoard(boardFromDB)

      // sort columns

      // boardFromDB.columns.sort(function (a, b) {
      //   return (
      //     boardFromDB.columnOrder.indexOf(a.id) -
      //     boardFromDB.columnOrder.indexOf(b.id)
      //   );
      // });
      // setColumns(boardFromDB.columns);
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }
  }, [])

  if (isEmpty(board)) {
    return <div className='notfound'>Board not found</div>
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((col) => col.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find((col) => col.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map((card) => card.id)
      setColumns(newColumns)
    }
  }
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
              <Column column={column} onCardDrop={onCardDrop} />
            </Draggable>
          )
        })}
      </Container>
      {/* Add new Column */}
      <div className='add-new-column'>
        <i className='fa fa-plus' /> Add another column
      </div>
    </div>
  )
}

export default BoardContent

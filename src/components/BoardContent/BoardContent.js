import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'

import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'

import { fetchBoardDetails, createNewColumn } from 'actions/CallApi'

import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap'

const BoardContent = () => {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const ToggleCreateNewForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const enterListRef = useRef(null)
  useEffect(() => {
    if (enterListRef && enterListRef.current) {
      enterListRef.current.focus()
      enterListRef.current.select()
    }
  }, [openNewColumnForm])

  const onNewColumnTitleChange = useCallback(
    (e) => setNewColumnTitle(e.target.value),
    []
  )

  useEffect(() => {
    const boardId = '62955f31cec7324f70c34061'
    fetchBoardDetails(boardId).then((board) => {
      console.log(board)
      setBoard(board)
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
    })
  }, [])

  if (isEmpty(board)) {
    return <div className="notfound">Board not found</div>
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((col) => col._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find((col) => col._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map((card) => card._id)
      setColumns(newColumns)
    }
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      enterListRef.current.focus()
      return
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    }
    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = [...columns]
      newColumns.push(column)

      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map((col) => col._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)
      setNewColumnTitle('')
      setOpenNewColumnForm(false)
    })
  }
  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id
    let newColumns = [...columns]
    const columnIndexUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate
    )
    if (newColumnToUpdate._destroy) {
      // Remove column
      newColumns.splice(columnIndexUpdate, 1)
    } else {
      // Update title column
      newColumns.splice(columnIndexUpdate, 1, newColumnToUpdate)
    }
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((col) => col._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview',
        }}
      >
        {columns.map((column, idx) => {
          return (
            <Draggable key={idx}>
              <Column
                column={column}
                onCardDrop={onCardDrop}
                onUpdateColumnState={onUpdateColumnState}
              />
            </Draggable>
          )
        })}
      </Container>
      {/* Add new Column */}
      <BootstrapContainer className="bootstrap-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={ToggleCreateNewForm}>
              <i className="fa fa-plus" /> Add another column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                ref={enterListRef}
                size="sm"
                type="text"
                placeholder="Enter list title..."
                className="input-enter-new-column"
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(e) => e.key === 'Enter' && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add list
              </Button>{' '}
              <span
                className="cancel-icon"
                onClick={() => setOpenNewColumnForm(false)}
              >
                <i className="fa fa-trash icon" />
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  )
}

export default BoardContent

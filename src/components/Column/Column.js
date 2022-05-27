import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'

import { cloneDeep } from 'lodash'

import { Dropdown, Form, Button } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
const Column = (props) => {
  const { column, onCardDrop, onUpdateColumn } = props
  const [columnTitle, setColumnTitle] = useState('')
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const focusAddNewCardRef = useRef(null)
  useEffect(() => {
    if (focusAddNewCardRef && focusAddNewCardRef.current) {
      focusAddNewCardRef.current.focus()
      focusAddNewCardRef.current.select()
    }
  }, [openNewCardForm])

  const [newCardTitle, setNewCardTitle] = useState('')

  const toggleCreateNewCard = () => {
    setOpenNewCardForm(!openNewCardForm)
  }
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal)
  }
  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      // Remove column
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleConfirmModal()
  }

  const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
  }
  const handleColumnTitleChange = (e) => {
    setColumnTitle(e.target.value)
  }
  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      focusAddNewCardRef.current.focus()
      return
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle,
      cover: null
    }
    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)
    // console.log(newCardToAdd)
    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleCreateNewCard()
  }
  return (
    <div className='column'>
      <header className='column-drag-handle'>
        <div className='column-title'>
          {/* {column.title} */}
          <Form.Control
            size='sm'
            type='text'
            className='trello-content-editable'
            value={columnTitle}
            spellCheck={false}
            onClick={selectAllInlineText}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            onMouseDown={(e) => e.preventDefault()}
            // onKeyDown={(e) => e.key === 'Enter' && changeColumnTitle()}
          />
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle
              id='dropdown-basic'
              size='sm'
              className='dropdown-btn'
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleCreateNewCard}>
                Add card
              </Dropdown.Item>
              <Dropdown.Item onClick={toggleConfirmModal}>
                Remove column
              </Dropdown.Item>
              <Dropdown.Item>
                Remove all cards in this column (beta)
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className='card-list'>
        <Container
          groupName='adam-columns'
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass='card-ghost'
          dropClass='card-ghost-drop'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className='add-new-card-form'>
            <div className='container-for-box-shadow'>
              <Form.Control
                size='sm'
                as='textarea'
                rows='3'
                placeholder='Enter a title for this card...'
                className='input-enter-new-card'
                ref={focusAddNewCardRef}
                spellCheck={false}
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
              />
            </div>
          </div>
        )}
      </div>

      <footer>
        {openNewCardForm && (
          <>
            <Button variant='success' size='sm' onClick={addNewCard}>
              Add card
            </Button>{' '}
            <span className='cancel-icon' onClick={toggleCreateNewCard}>
              <i className='fa fa-trash icon' />
            </span>
          </>
        )}
        {!openNewCardForm && (
          <div className='footer-actions' onClick={toggleCreateNewCard}>
            <i className='fa fa-plus icon'></i>
            Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        title='Remove column'
        content={`Are you sure you want to delete <strong>${column.title}</strong> and all of its relative cards?`}
        show={showConfirmModal}
        onAction={onConfirmModalAction}
      />
    </div>
  )
}

export default Column

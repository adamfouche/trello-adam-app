import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'

import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'

import { Dropdown, Form } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
const Column = (props) => {
  const { column, onCardDrop, onUpdateColumn } = props

  const [columnTitle, setColumnTitle] = useState('')
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])
  // console.log('COLUMNS', column)
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
              <Dropdown.Item>Add card</Dropdown.Item>
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
      </div>
      <footer>
        <div className='footer-actions'>
          <i className='fa fa-plus icon'></i>
          Add another card
        </div>
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

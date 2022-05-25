import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import HTMLReactParser from 'html-react-parser'
import { MODAL_ACTION_CONFIRM, MODAL_ACTION_CLOSE } from 'utilities/constants'
function ConfirmModal(props) {
  const { show, title, content, onAction } = props

  return (
    <Modal
      show={show}
      backdrop='static'
      keyboard={false}
      onHide={() => onAction(MODAL_ACTION_CLOSE)}
    >
      <Modal.Header closeButton>
        <Modal.Title className='h5'>{HTMLReactParser(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => onAction(MODAL_ACTION_CLOSE)}
        >
          Close
        </Button>
        <Button
          variant='primary'
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal

import React from 'react'
import { Modal, ModalBody, Button } from "reactstrap";


export default function ConfirmDialog({ isOpen, toggle, submitForm, size }) {
    return (
        <Modal isOpen={isOpen} toggle={toggle} size={size == undefined ? 'md' : size}>
            <ModalBody>
                <h5 className='f-20 fw-600 mt-3'>Are you certain you want to delete this ?</h5>
                <div> Deleting this will remove it permanently.</div>
                <div className="d-flex mt-4 justify-content-end">
                    <Button className="border" color="white" onClick={toggle}>
                        Cancel
                    </Button>

                    <Button color="danger ml-3 " onClick={submitForm}>
                        Delete
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}

import React from "react";
import { Modal } from "reactstrap";
import { RiDeleteBinLine } from "react-icons/ri";

const DeleteModal = ({ isOpen, toggle, onConfirm, user }) => {
  // const [modal, setModal] = useState(false);
  // const toggle = () => setModal(!modal);?
  return (
    <Modal size="md" isOpen={isOpen} toggle={toggle}>
      <div className="p-4">
        <h3>Delete {user}</h3>
        <div className="d-flex align-items-center mt-2 h5_delete">Are you sure you want to delete this {user}?</div>
        <div className="flex end mt-3">
          <div className="h7 pointer" style={{ marginRight: "17px" }} onClick={toggle}>
            Cancel
          </div>
          <button className="delete_btn border-none outline-none d-flex align-items-center parimary-background border-0" type="button" onClick={onConfirm}>
            <RiDeleteBinLine style={{ marginRight: "5px" }} />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

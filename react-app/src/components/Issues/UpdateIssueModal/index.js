import React, { useState } from 'react';
import { Modal } from '../../../context/Modal';
import UpdateIssueForm from './UpdateIssueForm.js';
import '../../CSS/UpdateIssues.css';

function UpdateIssueModal({showModal, setShowModal}) {
  // const [showModal, setShowModal] = useState(false);
  // console.log("============", showModal, setShowModal)
  return (
    <>
      <div onClick={() => setShowModal(true)}></div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UpdateIssueForm setModal={setShowModal}/>
        </Modal>
      )}
    </>
  );
}

export default UpdateIssueModal;

import React, { useState } from 'react';
import { Modal } from '../../../context/Modal';
import CreateIssueForm from './CreateIssueForm.js';
import '../../CSS/CreateIssues.css';

function CreateIssueModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)}>Create Issue</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {/* {console.log("CREATE ISSUE MODAL INDEX FILE ONCLOSE", showModal)} */}
          <CreateIssueForm setModal={setShowModal}/>
        </Modal>
      )}
    </>
  );
}

export default CreateIssueModal;

import React, { useState } from 'react';
import { Modal } from '../../../context/Modal';
import UpdateIssueForm from './UpdateIssueForm.js';
import '../../CSS/UpdateIssues.css';

function UpdateIssueModal({currIssue}) {
  const [showModal, setShowModal] = useState(false);
  // console.log("============", currIssue, showModal, setShowModal)
  return (
    <>
      {/* <div className="issue-card-container" onClick={() => setShowModal(true)}></div> */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {/* {console.log("did it get here? this is EditCommentModal", showModal)} */}
          <UpdateIssueForm currIssue={currIssue} setShowModal={setShowModal}/>
        </Modal>
      )}

    </>
  );
}

export default UpdateIssueModal;

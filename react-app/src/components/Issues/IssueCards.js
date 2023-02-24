import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { thunkGetAllPhasesIssues } from "../../store/issue";
import DeleteIssue from './DeleteIssue';
import { Modal } from '../../context/Modal';
import UpdateIssueForm from './UpdateIssueModal/UpdateIssueForm';

const IssueCards = ({phase, issue}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const curr_user = useSelector(state => state.session.user);
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase();

  return (
    <div className="issue-card-container" onClick={(e) => {
      if (!showModal) setShowModal(true)
      }}>
      {showModal &&(
        <Modal onClose={() => {
          dispatch(thunkGetAllPhasesIssues())
          setShowModal(false)
          }}>
          <UpdateIssueForm currIssue={issue} currPhase={phase}/>
        </Modal>)
      }

      <div className="issue-card-outer" key={issue.issueId}>
        {(issue.attachment?.includes("jpeg") || issue.attachment?.includes("png") || issue.attachment?.includes("jpg") || issue.attachment?.includes("gif")) && <img src={`${issue.attachment}`} alt={issue.attachment} className="issue-card-attachment-img"/>}
        <div className="issue-card-title">
          <div className="issue-summary">{issue.summary}</div>
          <DeleteIssue issueId={issue.issueId} phaseId={phase.id}/>
        </div>
        <div className="project-name-outer">
          <div className="project-name-left">
            <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
            <div className="project-name">{phase.Project.name}--{issue.issueId}</div>
          </div>
          {issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase() === curr_user_init
          ?
          <>
            {(issue.attachment?.includes("pdf") || issue.attachment?.includes("docx") || issue.attachment?.includes("xlsx")) && <i className="fa-solid fa-paperclip"></i>}
            <div className='curr-user-circle-small'>
              {curr_user_init}
            </div>
          </>
          :
          <>
            {(issue.attachment?.includes("pdf") || issue.attachment?.includes("docx") || issue.attachment?.includes("xlsx")) && <i className="fa-solid fa-paperclip"></i>}
            <div className='other-user-circle-small'>
              {issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase()}
            </div>
          </>
          }
        </div>
      </div>

    </div>
  )
}

export default IssueCards;

import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { thunkGetAllPhasesIssues } from "../../store/issue";
import DeleteIssue from './DeleteIssue';
import { Modal } from '../../context/Modal';
import UpdateIssueMainForm from './UpdateIssueModal/UpdateIssueMainForm';
import DropArea from './DropArea';

const IssueCards = ({issue, index, phase, projectNameInit, setActiveCard, onDrop}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  // console.log("IssueCard ---- phase.title:", phase.title)

  const curr_user = useSelector(state => state.session.user);
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase();
  const assigneeNameInit = issue?.Assignee?.first_name[0].toUpperCase() + issue?.Assignee?.last_name[0].toUpperCase();
  // console.log("Issue Cards ---- issue:", issue)

  return (
    <React.Fragment>
    <div className="issue-card-container" onClick={(e) => {
      if (!showModal) setShowModal(true)
      }}
      draggable={true}
      onDragStart={() => setActiveCard({index, issue})}
      // onDragEnd={() => setActiveCard(null)}
    >
      {showModal &&(
        <Modal onClose={async() => {
          await dispatch(thunkGetAllPhasesIssues())
          setShowModal(false)
          }}>
          <UpdateIssueMainForm currIssue={issue} currPhase={phase}  showModal={showModal} setShowModal={setShowModal}/>
        </Modal>)
      }

      <div className="issue-card-outer" key={issue.issueId} draggable>
        {issue.Attachment?.length >= 1 && (issue.Attachment[0]?.url?.includes("jpeg") || issue.Attachment[0]?.url?.includes("png") || issue.Attachment[0]?.url?.includes("jpg") || issue.Attachment[0]?.url?.includes("gif")) && <img src={`${issue.Attachment[0]?.url}`} alt={issue.Attachment} className="issue-card-attachment-img"/>}
        <div className="issue-card-title">
          <div className="issue-summary">{issue.summary}</div>
          <DeleteIssue issueId={issue.issueId} phaseId={phase.id}/>
        </div>
        <div className="project-name-outer">
          <div className="project-name-left">
            <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
            <div className="project-name">{projectNameInit}--{issue.issueId}</div>
          </div>
          {assigneeNameInit === curr_user_init
          ?
          <>
            {(issue.attachment?.includes("pdf") || issue.Attachment[0]?.url?.includes("docx") || issue.Attachment[0]?.url?.includes("xlsx") || issue.Attachment[0]?.url?.includes("ppt") || issue.Attachment[0]?.url?.includes("pptx")  || issue.Attachment[0]?.url?.includes("pdf")) && <i className="fa-solid fa-paperclip"></i>}
            <div className='curr-user-circle-small'>
              {curr_user_init}
            </div>
          </>
          :
          <>
            {(issue.attachment?.includes("pdf") || issue.Attachment[0]?.url?.includes("docx") || issue.Attachment[0]?.url?.includes("xlsx") || issue.Attachment[0]?.url?.includes("ppt") || issue.Attachment[0]?.url?.includes("pptx") || issue.Attachment[0]?.url?.includes("pdf")) && <i className="fa-solid fa-paperclip"></i>}
            {issue.Assignee && <div className='other-user-circle-small'>
              {assigneeNameInit}
            </div>}
          </>
          }
        </div>
      </div>
    </div>
    <DropArea onDrop={onDrop} phaseName={phase.title} index={index + 1}/>
    </React.Fragment>
  )
}

export default IssueCards;

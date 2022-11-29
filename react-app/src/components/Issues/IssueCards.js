import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import UpdateIssueModal from './UpdateIssueModal';
import DeleteIssue from './DeleteIssue';
import { Modal } from '../../context/Modal';
import UpdateIssueForm from './UpdateIssueModal/UpdateIssueForm';

const IssueCards = ({phase, issue}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState()
  // console.log("ISSUECARDS ISSUE/", issue, phase)
  const curr_user = useSelector(state => state.session.user)
  const curr_user_init = curr_user.first_name[0].toUpperCase() + curr_user.last_name[0].toUpperCase()

  // function activeDiv(issueId, e) {
  //   e.stopPropagation()
  //   setActiveId(issueId)
  //   setShowModal(true)
  //   window.addEventListener('click', () => {
  //     setShowModal(false);
  // })
  // }

  return (
    <div className="issue-card-container" onClick={(e) => {
      e.stopPropagation()
      window.addEventListener('click', () => {
        setShowModal(false);
      })
      setShowModal(true)
      }}>
      {/* {console.log("ISSUE MAPPING ISSUEID:", issue.issueId)} */}
    <div className="issue-card-outer" key={issue.issueId}>
      {/* {console.log("ISSUE-INDEX", i)} */}

      {showModal &&
        // <UpdateIssueModal currIssue={issue} showModal={showModal} setShowModal={setShowModal}/>
        <Modal onClose={() => setShowModal(false)}>
          <UpdateIssueForm currIssue={issue} setShowModal={setShowModal}/>
        </Modal>
      }

      <div className="issue-card-title">
        {/* <NavLink to={`/issues/${issue.issueId}`} style={{ textDecoration: 'none'}}> */}
          <div className="issue-summary">{issue.summary}</div>
        {/* </NavLink> */}
        <DeleteIssue issueId={issue.issueId} phaseId={phase.id}/>
      </div>
      {/* <NavLink to={`/issues/${issue.issueId}`} style={{ textDecoration: 'none'}}> */}
      <div className="project-name-outer">
        <div className="project-name-left">
          <div className='project-name-icon'><i className="fa-solid fa-square-check"></i></div>
          <div className="project-name">{phase.Project.name}--{issue.issueId}</div>
        </div>
        {issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase() === curr_user_init
        ?
        <div className='curr-user-circle-small'>{curr_user_init}</div>
        :
        <div className='other-user-circle-small'>{issue.user?.first_name[0].toUpperCase()+issue.user?.last_name[0].toUpperCase()}</div>
        }
      </div>
      {/* </NavLink> */}
    </div>
    </div>
    )
}

export default IssueCards;

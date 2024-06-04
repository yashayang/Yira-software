import { useSelector } from 'react-redux';
import UpdatedPhase from './UpdatePhase';
import DeletePhase from './DeletePhase';
import IssueCards from '../Issues/IssueCards';
import CreateIssueInPhase from '../Issues/CreateIssueInPhase';

const PhaseColumn = ({ phase, i, projectNameInit, projectId }) => {
const curr_user = useSelector(state => state.session.user);
const currUserId = curr_user?.id;

  return (
    <div className="card-container" key={i} draggable>
    <div className="phase-title-container" key={i}>
      <UpdatedPhase phaseId={phase.id} phaseTitle={phase.title} projectId={projectId} ownerId={currUserId}/>
      <DeletePhase phaseId={phase.id}/>
    </div>
      {phase.Issues && Object.values(phase.Issues).map((issue) => {
        return <IssueCards issue={issue} phase={phase} projectNameInit={projectNameInit}/>
      })}
      <CreateIssueInPhase phaseId={phase.id} assigneeId={currUserId}/>
  </div>
  )
}

export default PhaseColumn;

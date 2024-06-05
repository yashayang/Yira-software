import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllPhasesIssues } from "../../store/issue";
import UpdatedPhase from './UpdatePhase';
import DeletePhase from './DeletePhase';
import IssueCards from '../Issues/IssueCards';
import CreateIssueInPhase from '../Issues/CreateIssueInPhase';
import DropArea from '../Issues/DropArea';

const PhaseColumn = ({ phase, i, projectNameInit, projectId }) => {
  const dispatch = useDispatch();
  const phaseId = phase.id;
  // console.log("PhaseColumn ---- phaseId:", phaseId)
  const [issues, setIssues] = useState(Object.values(phase.Issues));
  // const [activeCard, setActiveCard] = useState(null);
  const activeCard = useSelector(state => state.dragndrop.activeCard);
  const activeIndex = useSelector(state => state.dragndrop.index);
  const phaseName = phase.title;

  // console.log("PhaseColumn ---- phaseName:", phaseName)
  // console.log("PhaseColumn ---- activeCard:", activeCard)

  // console.log("PhaseColumn ---- issues:", issues)

  const curr_user = useSelector(state => state.session.user);
  const currUserId = curr_user?.id;

  const onDrop = (phaseName, index) => {
    console.log(`${activeCard.summary} is going to place into ${phaseName} and at index ${index}`);

    if (activeCard === null) return;

    let updatedCards = []
    if (activeCard.phaseId === phaseId) {
      updatedCards = issues.filter((issue, i) => i !== activeIndex);
      updatedCards.splice(index, 0, {
        ...activeCard,
        Phase: phase
      });
      setIssues(updatedCards);
    } else {
      console.log("PhaseColumn ---- different phase - issues:", issues)
      console.log("PhaseColumn ---- different phase - updateCards:", updatedCards)
      issues.splice(index, 0, {
        ...activeCard,
        Phase: phase
      });
      setIssues(issues);
      console.log("PhaseColumn ---- afterOnDrop:", updatedCards)
    }

  }

  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
  }, [dispatch])

  return (
    <div className="card-container" key={i} draggable>
    <div className="phase-title-container" key={i}>
      <UpdatedPhase phaseId={phase.id} phaseTitle={phase.title} projectId={projectId} ownerId={currUserId}/>
      <DeletePhase phaseId={phase.id}/>
    </div>
    <DropArea onDrop={onDrop} phaseName={phaseName} index={0}/>
      {phase.Issues && issues.map((issue, index) => {
        return <IssueCards
                  issue={issue}
                  index={index}
                  phase={phase}
                  projectNameInit={projectNameInit}
                  // setActiveCard={setActiveCard}
                  onDrop={onDrop}
                />
      })}
      <CreateIssueInPhase phaseId={phase.id} assigneeId={currUserId}/>
    {/* <h1>Active Card - {activeCard.index}</h1> */}
  </div>
  )
}

export default PhaseColumn;

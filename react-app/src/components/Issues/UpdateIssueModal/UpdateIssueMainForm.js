import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetOneIssue, thunkGetAllPhasesIssues, cleanState } from "../../../store/issue";
import { loadAllUsers } from '../../../store/session';
import { thunkLoadAttachments } from "../../../store/attachment";
import UpdateSummaryForm from './UpdateSummaryForm';
import UploadAttachmentFrom from '../../Attachments/UploadAttachmentForm';
// import UpdateDescriptionForm from './UpdateDescriptionForm';
// import ViewAttachmentsForm from '../../Attachments/ViewAttachmentsForm';
import UpdatePhaseForm from './UpdatePhaseForm';
import UpdateAssigneeReporterForm from './UpdateAssigneeReporterForm';
import "../../CSS/UpdateIssues.css"


const UpdateIssueMainForm = ({currIssue, currPhase}) => {
  // console.log("UpdateIssueForm----currIssue", currIssue)
  // console.log("UpdateIssueForm----currPhase", currPhase)
  const dispatch = useDispatch();
  const singleIssue = useSelector(state => state.issues.SingleIssue);
  const issueId = currIssue.issueId;
  const phaseTitle = currPhase.title;


  useEffect(() => {
    let isMounted = true;
    if(isMounted) {
      dispatch(thunkGetOneIssue(parseInt(issueId)))
      dispatch(loadAllUsers())
      dispatch(thunkGetAllPhasesIssues())
      dispatch(thunkLoadAttachments(issueId))
    }
    return () => {
      isMounted = false;
      dispatch(cleanState())
    }
  }, [dispatch, issueId])


  if(!singleIssue) return null;

  return (
    <div className="update-issue-main-container">
      <div className="update-issue-left-container">
        <div className="update-issue-title">{phaseTitle}<span>{" / "}</span><span>Issue #{issueId}</span></div>
        <UpdateSummaryForm currIssue={currIssue} />
        <UploadAttachmentFrom issueId={issueId} currIssue={currIssue}/>
        {/* <UpdateDescriptionForm currIssue={currIssue} />
        <ViewAttachmentsForm attachments = {currIssue.Attachment}/> */}

        <div className="update-issue-footer"></div>

      </div>

      <div className="update-issue-right-container">
        <UpdatePhaseForm currIssue={currIssue}/>
        <UpdateAssigneeReporterForm currIssue={currIssue} />
        <div className="update-issue-time-container">
          <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)}</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)}</div>
        </div>
        <div className="update-issue-footer"></div>
      </div>

    </div>
  )
}

export default UpdateIssueMainForm;

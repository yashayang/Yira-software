import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { thunkGetOneIssue, thunkGetAllPhasesIssues, cleanState } from "../../../store/issue";
import { loadAllUsers } from '../../../store/session';
import UpdateSummaryForm from './UpdateSummaryForm';
import UpdateDescriptionForm from './UpdateDescriptionForm';
import UploadAttachmentFrom from '../../Attachments/UploadAttachmentForm';
import UpdatePhaseForm from './UpdatePhaseForm';
import ViewAttachmentsForm from '../../Attachments/ViewAttachmentsForm';
import UpdateAssigneeReporterForm from './UpdateAssigneeReporterForm';
import "../../CSS/UpdateIssues.css"


const UpdateIssueMainForm = ({currIssue, currPhase}) => {
  console.log("UpdateIssueForm----currIssue", currIssue)
  // console.log("UpdateIssueForm----currPhase", currPhase)

  const dispatch = useDispatch();
  const singleIssue = useSelector(state => state.issues.SingleIssue)
  const issueId = currIssue.issueId;
  const phaseTitle = currPhase.title;
  const currAttachment = currIssue.Attachment[0]?.url;

  const getExtension = (fileName) =>{
    if (fileName){
       const urlArr = fileName.split('.');
       const ext = urlArr[urlArr.length-1];
       return ext
    }
    return "jpg"
 }
 const docs = [
   {uri: currAttachment,
   fileName : currAttachment,
   fileType: getExtension(currAttachment)
   //Access-Control-Allow-Origin :"*"
 },]
//  console.log("UpdateIssueForm-doc-viewer----currAttachment", currAttachment)
//  console.log("UpdateIssueForm-doc-viewer----docs", docs)


  const [attachLoading, setAttachLoading] = useState(false);
  const [attachErrors, setAttachErrors] = useState([]);


  useEffect(() => {
    let isMounted = true;
    if(isMounted) {
      dispatch(thunkGetOneIssue(parseInt(issueId)))
      dispatch(loadAllUsers())
      dispatch(thunkGetAllPhasesIssues())
    }
    return () => {
      isMounted = false;
      dispatch(cleanState())
    }
  }, [dispatch])


  if(!singleIssue) return null;

  return (
    <div className="update-issue-main-container">
      <div className="update-issue-left-container">
        <div className="update-issue-title">{phaseTitle}<span>{" / "}</span><span>Issue #{issueId}</span></div>
        <UpdateSummaryForm currIssue={currIssue} />
        <UploadAttachmentFrom issueId={issueId} currIssue={currIssue}/>
        <UpdateDescriptionForm currIssue={currIssue} />
        <ViewAttachmentsForm attachments = {currIssue.Attachment}/>
        <div className="update-issue-attachment-container">
          {attachLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Loading..." className="update-issue-attachment-loading"/>}
          {currAttachment &&
            <>
              <div className="update-issue-attachment-label">Attachment</div>
              {(currAttachment?.includes("jpeg") || currAttachment?.includes("png") || currAttachment?.includes("jpg") || currAttachment?.includes("gif"))
                ? <img src={`${currAttachment}`} alt={currAttachment} className="update-issue-attachment-img"/>
                : <DocViewer
                // documents={
                //   !currAttachment ?
                //   attachment?.map((file) => ({
                //     uri: window.URL.createObjectURL(file),
                //     fileName: file.name,
                //   }))
                //   : docs
                // }
                documents={docs}
                pluginRenderers={DocViewerRenderers}
                config={{
                  header: {
                    disableHeader: false,
                    disableFileName: true,
                    retainURLParams: false,
                    mode: 'cors'
                  },
                  mode: 'cors'
                }}
                />
              }
            </>
          }
        </div>

        <div className="update-issue-time-container">
          {/* <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)}</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)}</div> */}
        </div>
      </div>

      <div className="update-issue-right-container">
        <UpdatePhaseForm currIssue={currIssue}/>
        <UpdateAssigneeReporterForm currIssue={currIssue} />
        <div className="update-issue-time-container">
          <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)}</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)}</div>
        </div>
      </div>

    </div>
  )
}

export default UpdateIssueMainForm;

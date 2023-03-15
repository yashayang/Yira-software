import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { thunkUpdateIssue, thunkGetOneIssue, thunkGetAllPhasesIssues, cleanState } from "../../../store/issue";
import { loadAllUsers } from '../../../store/session';
import "../../CSS/UpdateIssues.css"


const UpdateIssueForm = ({currIssue, currPhase}) => {
  // console.log("UpdateIssueForm----currIssue", currIssue)
  // console.log("UpdateIssueForm----currPhase", currPhase)

  const dispatch = useDispatch();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)
  const allPhases = useSelector(state => state.issues.AllPhases)
  const allPhasesArr = Object.values(allPhases)
  const singleIssue = useSelector(state => state.issues.SingleIssue)
  const issueId = currIssue.issueId;
  const phaseTitle = currPhase.title
  const currSummary = singleIssue?.summary;
  const currDescription = singleIssue?.description;
  const currPhaseId = singleIssue?.phaseId;
  const currAssigneeId = currIssue.Assignee?.id;
  const currAttachment = currIssue.Attachment[0]?.url;
  console.log("UpdateIssueForm----currAssigneeId", currAssigneeId)

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

  const [summary, setSummary] = useState(currSummary);
  const [summaryInput, setSummaryInput] = useState(false);
  const [summaryErrors, setSummaryErrors] = useState([]);
  const [description, setDescription] = useState(currIssue.description);
  const [descriptionInput, setDescriptionInput] = useState(false);
  const [descriptionErrors, setDescriptionErrors] = useState([]);
  const [phaseId, setPhaseId] = useState();
  const [assigneeId, setAssigneeId] = useState(currAssigneeId)

  const [attachment, setAttachment] = useState(currAttachment);
  const [attachLoading, setAttachLoading] = useState(false);
  const [attachErrors, setAttachErrors] = useState([]);
  const [uploadBtn, setUploadBtn] = useState(false);


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


  const showSummary = async (e) => {
    setSummary(currSummary)
    setDescription(currIssue.description)
    setDescriptionInput(false)
    setSummaryInput(true)
    setAttachErrors([])
  }

  const handleSummary = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setSummaryErrors([])

    const issue = {
      summary,
      description: currDescription,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }

    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setSummaryErrors(errorsArr)
    }

    if (response.issueId) {
      setSummaryInput(false)
      dispatch(thunkGetOneIssue(parseInt(issueId)))
      // dispatch(thunkGetAllPhasesIssues())
    }
  }

  const handleAttachment = async(e) => {
    // console.log("UpdateIssueForm-handleAttachment-enter!!!!")
    e.stopPropagation()
    e.preventDefault()
    // setAttachment(e.target.files[0])
    setAttachErrors([])

    const formData = new FormData()
    // formData.append("summary", currIssue.summary)
    // formData.append("description", currDescription)
    // formData.append("phase_id", parseInt(currPhaseId))
    // formData.append("owner_id", parseInt(currAssigneeId))
    formData.append("attachment", attachment[0])
    for(let value of formData.values()) {
      // console.log("UpdateIssueForm-handleAttachment---value", value)
    }
    // console.log("UpdateIssueForm-handleAttachment---attachment[0]", attachment[0], Array.isArray(attachment))
    // console.log("UpdateIssueForm-handleAttachment---formData.attachment", formData.attachment)
    // console.log("UpdateIssueForm-handleAttachment---currIssue.summary/attachment", currIssue.summary, currIssue.attachment)
    // console.log("UpdateIssueForm-handleAttachment---formData-PHASEID", parseInt(currPhaseId))

    setAttachLoading(true)
    const response = await dispatch(thunkUpdateIssue(issueId, formData, currPhaseId, attachment))
    // console.log("UpdateIssueForm-handleAttachment---response", response)

    let errorsArr = []
    if(response.errors) {
      setAttachLoading(false)
      if(response.errors[0].length > 40) {
        let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
        errorsArr.push(errorMsg)
      } else if(!Array.isArray(response)) {
        errorsArr.push(response.errors)
      } else {
        errorsArr.push(response.errors[0])
      }
      setAttachErrors(errorsArr)
      // if (attachErrors) {
        //   setTimeout(() => {
          //     const errorsDiv = document.getElementById('update-issue-attachment-errors');
          //     errorsDiv.style.display = 'none';
          //   }, 3000);
          //   setAttachment(null)
          //   await dispatch(thunkGetOneIssue(parseInt(issueId)))
          // }
        }
        if(response.issueId) {
          setAttachLoading(false)
          await dispatch(thunkGetOneIssue(parseInt(issueId)))
    }
}


  const handleDescription = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setDescriptionErrors([])
    setSummaryInput(false)

    const issue = {
      // summary: currSummary,
      // description,
      // phaseId: currPhaseId,
      // assigneeId: currAssigneeId
      description,
      "owner_id": parseInt(currIssue.ownerId),
      "phase_id": parseInt(currIssue.phaseId),
      "summary" : currIssue.summary
    }

    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setDescriptionErrors(errorsArr)
    }

    if (response.issueId) {
      setDescriptionInput(false)
      setDescription(currDescription)
    }
  }

  const handlePhaseId = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setDescriptionInput(false)
    setSummaryInput(false)
    setAttachErrors([])

    const issue = {
      // summary: currSummary,
      // description: currDescription,
      // phaseId: Number(e.target.value),
      // assigneeId: currAssigneeId
      "phase_id": Number(e.target.value)
    }
    console.log("UpdateIssueForm-handlePhaseId---issue:", issue)
    await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
  }

  const handleAssigneeId = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setAssigneeId(e.target.value)
    setDescriptionInput(false)
    setSummaryInput(false)
    setAttachErrors([])
    // console.log("UPDATE ISSUE-handleAssigneeId-Assignee:", e.target.value)
    const issue = {
      // summary: currSummary,
      // description: currDescription,
      // phaseId: phaseId ? phaseId : currPhaseId,
      // assigneeId: Number(e.target.value)
      "owner_id": Number(e.target.value)
    }
    console.log("UPDATE ISSUE-handleAssigneeId-issue:", issue)
    await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
  }


  if(!singleIssue) return null;

  return (
    <div className="update-issue-main-container">
      <div className="update-issue-left-container">
        <div className="update-issue-title">{phaseTitle}<span>{" / "}</span><span>Issue #{issueId}</span></div>

        <div className="update-issue-summary-errors">
          {
          summaryErrors &&
          summaryErrors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>
        {!summaryInput
        ? <div className="update-issue-summary" onClick={showSummary}><span>{currSummary}</span></div>
        : <div className="update-issue-summary-input-container">
            <form onSubmit={handleSummary} id="summary-form">
              <div>
                <input
                  type="text"
                  value={summary}
                  required
                  onChange={(e) => setSummary(e.target.value)}
                  className="update-issue-summary-input"
                />
              </div>
              <div className="update-issue-summary-button-container">
                <button type="submit" className="update-issue-summary-button"><i className="fa-sharp fa-solid fa-check"></i></button>
                <button  className="update-issue-summary-button" onClick={() =>{
                  setSummaryErrors([])
                  setSummary(currSummary)
                  setSummaryInput(false)
                  }}>
                  <i className="fa-sharp fa-solid fa-xmark"></i></button>
              </div>
            </form>
          </div>
        }

        <div className="update-issue-attachment-errors" id="update-issue-attachment-errors">
          {
          attachErrors &&
          attachErrors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>
        {!currAttachment && <form onSubmit={handleAttachment} className="update-issue-attachment-upload-container">
          {/* <label for="file-upload" className="custom-file-upload">
            <div><i className="fa-solid fa-paperclip" id="update-issue-paperclip"></i></div>
            <span className="upload-issue-attach-label">Attach</span>
          </label> */}
          <div className="file-upload-container">
            <input
              id="file-upload"
              type="file"
              accept="attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) =>{
                setAttachErrors([])
                e.target.files?.length && setAttachment(Array.from(e.target.files))
              }}
              required
            />
            <button type="submit" className="update-issue-upload-button">Submit</button>
          </div>
          </form>}

        <div className="update-issue-description">
          <label className="update-issue-description-label">Description</label>
          <div className="update-issue-description-errors">
            {
            descriptionErrors &&
            descriptionErrors.map((error)=>(<div key={error}>{error}</div>))
            }
          </div>
          {!descriptionInput &&
            <div onClick={() => {
              setDescriptionInput(true)
              setSummaryInput(false)
              setAttachErrors([])
              }}
              className="update-issue-description-placeholder"
            >
              {currDescription
              ? <div>{currDescription}</div>
              : <div>Add a description...</div>}
            </div>}
          {descriptionInput && <form className="update-issue-description-input-container" onSubmit={handleDescription}>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="update-issue-description-input"
            />
            <div className="update-issue-description-button-container">
              <button className="update-issue-description-save">Save</button>
              <div className="update-issue-description-cancel" onClick={() =>{
                setDescriptionErrors([])
                setDescription(currDescription)
                setDescriptionInput(false)
                }}>Cancel</div>
            </div>
          </form>}
        </div>

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
          <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)}</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)}</div>
        </div>
      </div>

      <div className="update-issue-right-container">

        <div>
          <select
            name="phaseId"
            value={phaseId}
            onChange={handlePhaseId}
            className="update-issue-right-phase-selector"
          >
          {allPhasesArr?.map((phase, i) => phase.id === currPhaseId ? <option value={currPhaseId} selected key={i}>{phase.title}</option> : <option value={Number(phase.id)} key={i}>{phase.title}</option>)}
          </select>
        </div>

        <div className="update-issue-right-assignee-reporter">
          <div className="update-issue-assignee">
            <div className="update-issue-label-container">
              <label>Assignee</label>
            </div>
            <div>
              <select
                name="assigneeId"
                value={assigneeId}
                className="update-issue-assignee-select"
                onChange={handleAssigneeId}
              >
              {allUsersArr?.map((user, i) => {
                return (
                  user.id === currIssue.ownerId
                  ? <option selected value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>
                  : <option value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="update-issue-reporter">
            <div className="update-issue-label-container">
              <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
            </div>
            <div>
              <select
                name="reporter"
                className="update-issue-assignee-select"
                // onChange={(e) => setAssigneeId(e.target.value)}
              >
              <option disabled selected>{currUser.first_name[0].toUpperCase() + currUser.first_name.slice(1) + " " + currUser.last_name[0].toUpperCase() + currUser.last_name.slice(1)}</option>
              {/* {allUsersArr?.map((user, i) => <option value={user.id} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)} */}
              </select>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default UpdateIssueForm;

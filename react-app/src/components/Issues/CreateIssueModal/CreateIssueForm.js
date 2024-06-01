import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateIssue } from "../../../store/issue";
import { thunkGetAllPhasesIssues } from '../../../store/issue';
import { thunkUploadAttachment } from "../../../store/attachment";
import { loadAllUsers } from '../../../store/session';
import "../../CSS/CreateIssues.css"

const CreateIssue = ({setModal}) => {
  const dispatch = useDispatch();
  const currUser = useSelector(state => state.session.user);
  const allUsersArr = useSelector(state => state.session.AllUsers?.users);
  const allPhases = useSelector(state => state.issues.AllPhases);
  const allPhasesArr = Object.values(allPhases);

  const [phaseId, setPhaseId] = useState(1);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("Unassigned")
  const [reportorId, setReportorId] = useState(currUser.id)
  const [attachment, setAttachment] = useState(null)
  const [errors, setErrors] = useState([]);
  const [fileTypeError, setFileTypeErrors] = useState([])
  const [summaryError, setSummaryError] = useState([])


  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
    dispatch(loadAllUsers())
  }, [dispatch]);

  // Validation functions:
  // File Type validation function
  const isAllowedFileType = (fileName) => {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'docx', 'pdf', 'xlsx', 'ppt']
    const fileExtension = fileName.split(".").pop().toLowerCase()
    return allowedExtensions.includes(fileExtension)
  };

  // Validate File Type synchroneously
  const handleAttachmentFileTypeChange = (e) => {
    const value = e.target.files[0]
    const fileName = value.name
    setAttachment(value)
    if (!isAllowedFileType(fileName)) {
      setFileTypeErrors(["Invalid file type. Please upload a file with the following extensions: .png .jpg .jpeg .gif .docx .pdf .xlsx .ppt"])
    } else {
      setFileTypeErrors([])
    }
  }

  // Summary validation function
  const validateSummary = (summary) => {
    if (summary.length > 0 && summary.length < 6) {
      return "Summary must be at least 6 characters long"
    }
    if (summary.length > 100){
      return "Summary must be less than 100 characters long"
    }
  };

  // Validate Summary synchroneously
  const handleSummaryChange = (e) => {
    const value = e.target.value
    setSummary(value)
    const errorMessage = validateSummary(value)
    if (errorMessage) {
      setSummaryError([errorMessage])
    } else {
      setSummaryError([])
    }
  }

  // Form submission:
  const handleSubmit = async(e) => {
    e.preventDefault()
    setErrors([])

    // Validate attachment before sending anything to the backend
    if (attachment && !isAllowedFileType(attachment.name)){
      setErrors(["Invalid file type. Please upload a file with the following extensions: .png .jpg .jpeg .gif .docx .pdf .xlsx .ppt"]);
    } else {
      const issueInfo = {
        summary,
        description,
        phase_id: parseInt(phaseId),
        owner_id: parseInt(reportorId),
        assignee_id: assigneeId === "Unassigned" ? 0 : parseInt(assigneeId)
      }

      const response = await dispatch(thunkCreateIssue(phaseId, issueInfo))

      let errorsArr = []
      if(response.errors) {
        let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
        errorsArr.push(errorMsg)
        setErrors(errorsArr)
      } else if (attachment) { // If there is an attachment, sending it to the backend
        const data = {
          issueId: response.issueId, // response.issueId is the id of the newly created issue
          name: attachment.name,
          attachment
        }

        const res = await dispatch(thunkUploadAttachment(data))
        if (res.errors) {
          errorsArr.push(res.errors)
          setErrors(errorsArr)
        } else {
          setModal(false)
          await dispatch(thunkGetAllPhasesIssues())
        }
      } else if (response.summary) {
        setModal(false)
      }
    }
  };

  const handleCancel = async(e) => {
    e.preventDefault()
    setModal(false)
  };

  if (!allPhases) return null;

  return (
    <div className="create-issue-main-container">
    <form onSubmit={handleSubmit} className="create-issue-form">
      <div className="create-issue-title">Create Issue</div>
      <div className="create-issue-validation-errors">
        {
        errors &&
        errors.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>

      <div className="create-issue-label-container">
        <label>Phases</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div className="create-issue-select-container">
        <select
          name="phaseId"
          className="create-issue-select"
          required
          value={phaseId}
          onChange={(e) => setPhaseId(e.target.value)}
        >
        {allPhasesArr?.map((phase, i) => <option value={phase.id} key={i}>{phase.title}</option>)}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>Summary</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div className="create-issue-validation-errors">
        {
        summaryError &&
        summaryError.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>
      <div className="create-issue-summary-input-outer">
        <input className="create-issue-summary-input"
          type="text"
          value={summary}
          required
          onChange={handleSummaryChange}
        />
      </div>

      <div className="create-issue-label-container">
        <label>Description</label>
      </div>
      <div>
        <textarea className="create-issue-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="create-issue-label-container">
        <label>Assignee</label>
      </div>
      <div>
        <select
          name="assigneeId"
          value={assigneeId}
          className="create-issue-assignee-select"
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">
            Unassigned
          </option>
          {allUsersArr?.map((user, i) => (
            <option value={Number(user.id)} key={i}>
              {user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div>
        <select
          name="reporter"
          className="create-issue-assignee-select"
          value={reportorId}
          onChange={(e) => setReportorId(e.target.value)}
        >
          {allUsersArr?.map((user, i) =>
            <option value={user.id} key={i}>
              {user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}
            </option>
          )}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>(File type: .png .jpg .jpeg .gif .docx .pdf .xlsx .ppt)</label>
      </div>
      <div className="create-issue-validation-errors">
        {
        fileTypeError &&
        fileTypeError.map((error)=>(<div key={error}>{error}</div>))
        }
      </div>
      <div className="create-issue-attachment-container">
        <input
          type="file"
          accept="attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleAttachmentFileTypeChange}
          className="file-input-button"
        />
      </div>

      <div className="create-issue-footer">
        <div className="create-issue-button-container">
        <div className="create-issue-cancel" onClick={handleCancel}>Cancel</div>
        <button className="create-issue-create-button" type="submit">Create</button>
        </div>
      </div>

    </form>

  </div>
  )
}

export default CreateIssue;

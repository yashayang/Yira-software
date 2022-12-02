import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateIssue } from "../../../store/issue";
import { thunkGetAllPhasesIssues } from '../../../store/issue';
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
  const [assigneeId, setAssigneeId] = useState(currUser.id)
  const [errors, setErrors] = useState([]);

  const [attachment, setAttachment] = useState(null)
  const [attachLoading, setAttachLoading] = useState(false)

  // console.log("CREATE ISSUE - allPhasesArr", allPhasesArr)

  useEffect(() => {
    dispatch(thunkGetAllPhasesIssues())
    dispatch(loadAllUsers())
  }, [dispatch])


  const handleSubmit = async(e) => {
    console.log("!!!!!!!!!!")
    e.stopPropagation()
    e.preventDefault()
    setErrors([])
    // const issueInfo = { summary, description, phaseId, assigneeId }
    console.log("CREATEISSUE FORM-summary, description, phaseId, attachment:", summary, description, phaseId, assigneeId, attachment)
    if (attachment) {
      const formData = new FormData()
      formData.append("summary", summary)
      formData.append("description", description)
      formData.append("phase_id", parseInt(phaseId))
      formData.append("owner_id", parseInt(assigneeId))
      formData.append("image", attachment)

      setAttachLoading(true)
      console.log("CREATEISSUE FORM-formData:", formData)
      const response = await dispatch(thunkCreateIssue(phaseId, formData))
      console.log("!!!!!!!", response)
      let errorsArr = []
      if(response.errors) {
        if(response.errors[0].length > 40) {
          let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
          errorsArr.push(errorMsg)
        } else if(!Array.isArray(response)) {
          errorsArr.push(response.errors)
        } else {
          errorsArr.push(response.errors[0])
        }

        setErrors(errorsArr)
      } else {
        setModal(false)
        await dispatch(thunkGetAllPhasesIssues())
      }
    }

    const issueInfo = {
      summary,
      description: "",
      attachment: "",
      phase_id: parseInt(phaseId),
      owner_id: parseInt(assigneeId)
    }
    console.log("CREATE ISSUE IN PHASE -issueInfo", issueInfo)
    const response = await dispatch(thunkCreateIssue(phaseId, issueInfo))

    console.log("CREATE ISSUE IN PHASE -response", response)

    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      // console.log("!!!!!!!", errorsArr)
      setErrors(errorsArr)
    } else {
      setModal(false)
      await dispatch(thunkGetAllPhasesIssues())
    }
  }


  const handleCancel = async(e) => {
    e.preventDefault()
    setModal(false)
  }

  const updateAttachment = (e) => {
    e.stopPropagation()
    const file = e.target.files[0];
    setAttachment(file);
  }



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
      <div className="create-issue-summary-input-outer">
        <input className="create-issue-summary-input"
          type="text"
          value={summary}
          required
          onChange={(e) => setSummary(e.target.value)}
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
          className="create-issue-assignee-select"
          onChange={(e) => setAssigneeId(e.target.value)}
        >
        {/* <option disabled selected value={Number(assigneeId)}>Unassigned</option> */}
        <option disabled selected value={Number(assigneeId)}>{currUser?.first_name[0].toUpperCase() +currUser?.first_name.slice(1) + " " + currUser?.last_name[0].toUpperCase() +currUser?.last_name.slice(1)}</option>
        {allUsersArr?.map((user, i) => <option value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)}
        </select>
      </div>

      <div className="create-issue-label-container">
        <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
      </div>
      <div>
        <select
          name="reporter"
          className="create-issue-assignee-select"
          // onChange={(e) => setAssigneeId(e.target.value)}
        >
        <option disabled selected>{currUser.first_name[0].toUpperCase() + currUser.first_name.slice(1) + " " + currUser.last_name[0].toUpperCase() + currUser.last_name.slice(1)}</option>
        {/* {allUsersArr?.map((user, i) => <option value={user.id} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)} */}
        </select>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={updateAttachment}
        />
      </div>

      <div className="create-issue-footer">
        <div className="create-issue-button-container">
        <div className="create-issue-cancel" onClick={handleCancel}>Cancel</div>
        <button className="create-issue-create-button" type="submit" onClick={handleSubmit}>Create</button>
        {/* {(attachLoading)&& <p>Loading...</p>} */}
        </div>
      </div>

    </form>
  </div>
  )
}

export default CreateIssue;

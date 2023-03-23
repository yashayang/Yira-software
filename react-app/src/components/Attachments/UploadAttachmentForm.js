import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetOneIssue } from "../../store/issue";
import { thunkUploadAttachment, thunkLoadAttachments } from "../../store/attachment";
import "../CSS/UpdateIssues.css"

const UploadAttachmentFrom = ({issueId, currIssue}) => {
  const dispatch = useDispatch();
  const currAttachment = useSelector(state => state.issues.SingleIssue.Attachment)
  const [attachment, setAttachment] = useState(null);
  const [name, setName] = useState(null);
  const [attachLoading, setAttachLoading] = useState(false);
  const [attachErrors, setAttachErrors] = useState([]);

  const handleAttachment = async(e) => {
    // console.log("UpdateIssueForm-handleAttachment-enter!!!!")
    e.stopPropagation()
    e.preventDefault()
    // setAttachment(e.target.files[0])
    setAttachErrors([])


    // console.log("UploadAttachmentForm ---- filename:", name)
    const data = { issueId, name, attachment }

    setAttachLoading(true)
    const response = await dispatch(thunkUploadAttachment(data))
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
          await dispatch(thunkLoadAttachments(issueId))
    }
}

  return (
    <>
      <div className="update-issue-attachment-errors" id="update-issue-attachment-errors">
      {
      attachErrors &&
      attachErrors.map((error)=>(<div key={error}>{error}</div>))
      }
    </div>
    {!currAttachment?.url && <form onSubmit={handleAttachment} className="update-issue-attachment-upload-container">
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
            // console.log("UploadAttachmentForm---- e.target.files", e.target.files)
            e.target.files?.length && setAttachment(Array.from(e.target.files)[0])
            e.target.files?.length && setName(Array.from(e.target.files)[0].name)
          }}
          required
        />
        <button type="submit" className="update-issue-upload-button">Submit</button>
      </div>
      </form>}
    </>
  )
}

export default UploadAttachmentFrom;

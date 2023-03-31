import { useDispatch } from "react-redux";
import { thunkDeleteAttachment } from "../../store/attachment";
import { thunkGetAllPhasesIssues } from "../../store/issue";
import "../CSS/Attachments/DeleteAttachment.css"
// import "../CSS//Attachments/ViewAttachments.css"

const DeleteAttachmentForm = ({activeDocId, attachmentId}) => {
  // console.log("!!!!!DELETE ATTACHMENT---activeDocId:", activeDocId)
  // console.log("!!!!!DELETE ATTACHMENT---attachmentId:", attachmentId)
  const dispatch = useDispatch();
  const handleAttachmentDelete = async(e) => {
    e.stopPropagation()
    e.preventDefault()
    let currAttachmentId
    if (window.confirm("Are you sure you want to delete this Attachment?")) {
      if (activeDocId) {
        currAttachmentId = activeDocId;
      } else {
        currAttachmentId = attachmentId;
      }
      // console.log("!!!!!DELETE ATTACHMENT---currAttachmentId:", currAttachmentId)
      let response = await dispatch(thunkDeleteAttachment(currAttachmentId))
      if (response.ok) {
        window.alert(`Attachment has been deleted!`)
        await dispatch(thunkGetAllPhasesIssues())
      }
      if (response.errors) {
        window.alert(`${response.errors}`)
      }
    }
  }

  return (
    <div className="attach-delete-container" onClick={handleAttachmentDelete}>
      <i className="fa-sharp fa-solid fa-trash"></i>
    </div>
  )
}

export default DeleteAttachmentForm;

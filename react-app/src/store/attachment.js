const LOAD_ATTACHMENTS = 'attachments/LOAD_ATTACHMENTS';
const UPLOAD_ATTACHMENT = 'attachments/UPLOAD_ATTACHMENT';
const DOWNLOAD_ATTACHMENT = 'attachments/DOWNLOAD_ATTACHMENT';
const DELETE_ATTACHMENT = 'attachments/DELETE_ATTACHMENT';

export const loadAttachments = (attachments) => {
  return {
      type: LOAD_ATTACHMENTS,
      attachments,
  }
}

export const uploadAttachment = (attachment) => {
  return {
    type: UPLOAD_ATTACHMENT,
    attachment
  }
}

export const thunkLoadAttachments = (issueId) => async (dispatch) => {
  const res = await fetch(`/api/attachments/${issueId}`);
  if (res.ok) {
      const attachments = await res.json();
      // console.log("----thunkLoadAttachments____attachments:", attachments)
      dispatch(loadAttachments(attachments));
      return attachments;
  }
}

export const thunkUploadAttachment = (data) => async (dispatch) => {
  const { issueId, name, attachment } = data
  const formData = new FormData()
  formData.append("issueId", issueId)
  formData.append("name", name)
  formData.append("attachment", attachment)
  // for (var entry of formData.entries()) {
  //   console.log("formData:", entry);
  // }
  // console.log("thunkUploadAttachment ---- issueId:", issueId)
  // console.log("thunkUploadAttachment ---- filename:", name)
  // console.log("thunkUploadAttachment ---- formData.issueId:", formData.issueId)
  try {
    const response = await fetch("/api/attachments/new", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      let error;
      if (response.status === 401 || 400) {
        error = await response.json();
        // console.log("thunkUploadAttachment --- error 401/400:", error)
        return error;
      } else {
        let errorJSON;
        error = await response.text();
        try {
          errorJSON = JSON.parse(error);
        } catch {
          throw new Error(error);
        }
        throw new Error(`${errorJSON.title}: ${errorJSON.message}`)
      }
    }

    const newAttachment = await response.json();
    // console.log("----thunkUploadAttachment____newAttachment:", newAttachment)
    dispatch(uploadAttachment(newAttachment));
    return newAttachment

  } catch(error) {
    // console.log("thunkUploadAttachment --- error:", error)
    throw error
  }
}

const attachments = (state = {Attachments:{}}, action) => {
  let newState
  switch(action.type) {
    case LOAD_ATTACHMENTS:
      newState = { ...state, Attachments: { ...state.Attachments } }
      action.attachments.attachments.forEach(attachment => {
        newState.Attachments[attachment.attachmentId] = attachment
      })
      return newState;

    case UPLOAD_ATTACHMENT:
      newState = {...state, Attachments: { ...state.Attachments } }
      newState.Attachments[action.attachment.attachmentId] = action.attachment
      return newState

    default:
      return state
  }
}

export default attachments;

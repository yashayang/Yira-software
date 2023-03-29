import "../CSS/Attachments/DownloadAttachment.css"
// import "../CSS//Attachments/ViewAttachments.css"

const DownloadAttachmentForm = ({activeDocUrl, attachmentUrl}) => {
  let currAttachmentUrl
  if (activeDocUrl) {
    currAttachmentUrl = activeDocUrl;
  } else {
    currAttachmentUrl = attachmentUrl;
  }

  return (
    <div className="attach-download-container">
      <a href={currAttachmentUrl} download target="_blank" rel="noreferrer">
        <i className="fa-solid fa-cloud-arrow-down"></i>
      </a>
    </div>
  )
}

export default DownloadAttachmentForm;

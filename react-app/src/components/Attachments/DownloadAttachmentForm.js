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
        <i class="fa-solid fa-cloud-arrow-down"></i>
      </a>
    </div>
  )
}

export default DownloadAttachmentForm;

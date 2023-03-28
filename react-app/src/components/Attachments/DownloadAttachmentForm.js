import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkDownloadAttachment } from "../../store/attachment";

const DownloadAttachmentForm = ({activeDocUrl, attachmentUrl}) => {
  console.log("!!!!!DOWNLOAD ATTACHMENT---attachmentUrl:", attachmentUrl)
  console.log("!!!!!DOWNLOAD ATTACHMENT---activeDocUrl:", activeDocUrl)
  let currAttachmentUrl
  if (activeDocUrl) {
    currAttachmentUrl = activeDocUrl;
  } else {
    currAttachmentUrl = attachmentUrl;
  }
  console.log("!!!!!DOWNLOAD ATTACHMENT---currAttachmentUrl:", currAttachmentUrl)
  // https://yiraawsbucket.s3.us-west-1.amazonaws.com/006536dfe7684e4f972c19e681288d38.pdf
  return (
    <div className="attach-download-container">
      <a href={currAttachmentUrl} download target="_blank" rel="noreferrer">
        <i class="fa-solid fa-cloud-arrow-down"></i>
      </a>
    </div>
  )
}

export default DownloadAttachmentForm;

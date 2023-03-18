import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { thunkGetOneIssue } from "../../store/issue";
import { thunkUploadAttachment } from "../../store/attachment";
import "../CSS/UpdateIssues.css"

const ViewAttachmentsForm = ({attachments}) => {
  const [attachLoading, setAttachLoading] = useState(false);
  const currAttachment = null

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
  return (
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
  )
}

export default ViewAttachmentsForm;

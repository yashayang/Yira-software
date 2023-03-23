import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { thunkGetOneIssue } from "../../store/issue";
import { thunkLoadAttachments } from "../../store/attachment";
import "../CSS/UpdateIssues.css"

const ViewAttachmentsForm = ({attachments, attachLoading, setAttachLoading}) => {
  const dispatch = useDispatch();
  // const [attachLoading, setAttachLoading] = useState(false);
  const currAttachment = attachments[0]?.url;
  const attachmentObj = useSelector(state => state.attachments.Attachments);
  const attachmentArr = Object.values(attachmentObj);
  const issueId = useSelector(state => state.issues.SingleIssue.issueId);
  console.log("ViewAttachmentsForm --- attachmentArr:", attachmentArr)

  // useEffect(() => {
  //   dispatch(thunkLoadAttachments(issueId))
  // }, [dispatch, issueId])

  const getExtension = (fileName) =>{
    if (fileName){
       const urlArr = fileName.split('.');
       const ext = urlArr[urlArr.length-1];
       return ext
      }
      return "jpg"
    }

    const docs = attachmentArr
    .filter((file) => (issueId === file.issueId))
    .map((file) => (
      {
      uri: file.url,
      fileName: file.name,
      fileType: getExtension(file.url),
    }));
    console.log("ViewAttachmentsForm --- issueId:", issueId)
    console.log("ViewAttachmentsForm --- docs:", docs)

  return (
    <div className="update-issue-attachment-container">
      {attachLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Loading..." className="update-issue-attachment-loading"/>}
      {currAttachment &&
        <>
          <div className="update-issue-attachment-label">Attachments{" "}({docs.length})</div>
          {/* {(currAttachment?.includes("jpeg") || currAttachment?.includes("png") || currAttachment?.includes("jpg") || currAttachment?.includes("gif"))
            ? <img src={`${currAttachment}`} alt={currAttachment} className="update-issue-attachment-img"/>
            : <DocViewer
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
          } */}
          <DocViewer
            className="doc-viewer-style"
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            prefetchMethod="GET"
            config={{
              header: {
                disableHeader: false,
                disableFileName: false,
                retainURLParams: false,
                mode: 'cors'
              },
              mode: 'cors'
            }}
            theme={{
              // primary: "#5296d8",
              secondary: "#615DEC",
              // tertiary: "#5296d899",
              textPrimary: "#888888",
              textSecondary: "#5296d8",
              textTertiary: "#00000099",
              // disableThemeScrollbar: false,
            }}
            />
        </>
      }
    </div>
  )
}

export default ViewAttachmentsForm;

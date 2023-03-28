import { useState } from "react";
import { useSelector } from "react-redux";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import DeleteAttachmentForm from './DeleteAttachmentFrom';
import "../CSS/UpdateIssues.css"

const ViewAttachmentsForm = ({attachLoading, setAttachLoading}) => {
  const attachmentObj = useSelector(state => state.attachments.Attachments);
  const attachmentArr = Object.values(attachmentObj);
  const issueId = useSelector(state => state.issues.SingleIssue.issueId);
  const currAttachmentUrl = attachmentArr.filter((file) => (issueId === file.issueId))[0]?.url;
  const currAttachmentId = attachmentArr.filter((file) => (issueId === file.issueId))[0]?.attachmentId;

  // console.log("ViewAttachmentsForm --- attachments:", attachments)
  // console.log("ViewAttachmentsForm --- currAttachmentId:", currAttachmentId)
  // console.log("ViewAttachmentsForm --- currAttachmentUrl:", currAttachmentUrl)
  // console.log("ViewAttachmentsForm --- attachmentArr:", attachmentArr)

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
      attachmentId: file.attachmentId
    }));

  // console.log("ViewAttachmentsForm --- docs:", docs)

  const [activeDocument, setActiveDocument] = useState(docs[0]);
  const [activeDocId, setActiveDocId] = useState(currAttachmentId);
  // console.log("ViewAttachmentsForm --- docs[0]:", docs[0])
  // console.log("ViewAttachmentsForm --- activeDocument:", activeDocument)

  const handleDocumentChange = (document) => {
    setActiveDocument(document);
    setActiveDocId(document.attachmentId)
  };

  return (
    <div className="update-issue-attachment-container">
      {currAttachmentUrl &&
        <>
          <div className="update-issue-attachment-label">Attachments{" "}({docs.length})</div>
          {attachLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Loading..." className="update-issue-attachment-loading"/>}
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
          {!attachLoading && <DocViewer
            className="doc-viewer-style"
            documents={docs}
            activeDocument={activeDocument}
            onDocumentChange={handleDocumentChange}
            // pluginRenderers={DocViewerRenderers}
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
          }
          <DeleteAttachmentForm activeDocId={activeDocId} attachmentId={currAttachmentId}/>
        </>
      }
    </div>
  )
}

export default ViewAttachmentsForm;

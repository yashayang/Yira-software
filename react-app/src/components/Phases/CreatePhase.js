import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreatePhase, thunkGetAllPhasesIssues } from "../../store/phase";
import '../CSS/CreatePhase.css';

const CreatePhase = ({projectId, ownerId}) => {
  // console.log("CREATE PHASE - PROJECTID & OWNERID:", projectId, ownerId)
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [titleInput, setTitleInput] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleCreatePhaseInput = () => {
    setTitleInput(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const phase = { title, projectId, ownerId}
    const response = await dispatch(thunkCreatePhase(projectId, phase))
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      // console.log("!!!!!!!", errorsArr)
      setErrors(errorsArr)
    } else {
      setTitleInput(false)
      dispatch(thunkGetAllPhasesIssues())
    }
  }

  return (
    <>
      {!titleInput && <div onClick={handleCreatePhaseInput} className="addPhase-main-container"><i className="fa-solid fa-plus" id="create-phase-plus"></i></div>}

      {titleInput &&
        <div className="card-container">
        <div className="create-issue-validation-errors">
          {
          errors &&
          errors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>
          <form onSubmit={handleSubmit}>
            <div className="phase-title-container">
              <input
                className="phase-title-input"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
              <div className="phase-create-button-container">
                <button type="submit" className="phase-create-submit-button"><i className="fa-sharp fa-solid fa-check"></i></button>
                <button className="phase-create-cancel-button" onClick={() =>{
                  setErrors([])
                  setTitleInput(false)
                  }}>
                  <i className="fa-sharp fa-solid fa-xmark"></i></button>
              </div>
          </form>
        </div>
      }

    </>
  )
}

export default CreatePhase;

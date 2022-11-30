import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdatePhase, thunkGetAllPhasesIssues } from "../../store/phase";
import '../CSS/CreatePhase.css';

const UpdatedPhase = ({phaseId, phaseTitle, projectId, ownerId}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(phaseTitle);
  const [titleInput, setTitleInput] = useState(false);
  const [errors, setErrors] = useState([]);


  const handleUpdatePhaseInput = () => {
    setTitleInput(true)
  }

  // useEffect(() =>{
  //   setTitle(phaseTitle)
  // }, [phaseTitle])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const phase = { title, projectId, ownerId }
    const response = await dispatch(thunkUpdatePhase(phaseId, phase))
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
      {!titleInput &&
        <div className="phase-title" onClick={handleUpdatePhaseInput}>
            {phaseTitle === "DONE" ? <div>{phaseTitle}<i className="fa-sharp fa-solid fa-check" id="phase-title-done"></i></div> : phaseTitle}
        </div>
      }

      {titleInput &&
        <div className="card-container">
        <div className="update-phase-validation-errors">
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
                setTitle(phaseTitle)
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

export default UpdatedPhase;

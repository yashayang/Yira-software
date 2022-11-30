import React from 'react';
// import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux"
import { thunkDeletePhase } from '../../store/phase';
import { thunkGetAllPhasesIssues } from '../../store/phase';
import { removePhase } from '../../store/issue';
import '../CSS/DeletePhase.css'

const DeletePhase = ({phaseId}) => {
  const dispatch = useDispatch();
  // const [showMenu, setShowMenu] = useState(false);
  // const allPhases = useSelector(state => state.phases.AllPhases);

  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true)
  // }

  // useEffect(() => {
  //   if (!showMenu) return;

  //   const closeMenu = () => {
  //     setShowMenu(false);
  //   }

  //   document.addEventListener('click', closeMenu);

  //   return () => document.removeEventListener('click', closeMenu);
  // }, [showMenu, allPhases])


  const handlePhaseDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Phase?")) {
      // console.log("DELETE ISSUE---issueId:", typeof issueId)
      let response = await dispatch(thunkDeletePhase(phaseId))
      dispatch(removePhase(phaseId))
      if (response.ok) {
        window.alert(`Issue has been deleted!`)
        dispatch(thunkGetAllPhasesIssues())
      }
      if (response.errors) {
        window.alert(`${response.errors}`)
      }
    }
  }

  return (
    <>
      <div className='phase-delete-icon-container' onClick={handlePhaseDelete}><i class="fa-solid fa-xmark"></i></div>
      {/* <div className='phase-ellipsis-container' onClick={openMenu}><i className="fa-solid fa-ellipsis"></i></div> */}
      {/* {console.log("DELETEPHASE:", showMenu)} */}
      {/* {showMenu && <div className='phase-delete-container'>
        <div className='phase-dropDown' onClick={handlePhaseDelete}>DELETE</div>
      </div>} */}
    </>
  )
}

export default DeletePhase;

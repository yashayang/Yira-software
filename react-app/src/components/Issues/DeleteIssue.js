import React from 'react';
// import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux"
import { thunkDeleteIssue } from '../../store/issue';
import { thunkGetAllPhasesIssues } from '../../store/issue';
import '../CSS/DeleteIssues.css'

const DeleteIssue = ({issueId, phaseId}) => {
  const dispatch = useDispatch();
  // const [showMenu, setShowMenu] = useState();
  // console.log("DELETE ISSUE---phaseId:", phaseId)

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
  // }, [showMenu])

  const handleIssueDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this Issue?")) {
      // console.log("DELETE ISSUE---issueId:", typeof issueId)
      let response = await dispatch(thunkDeleteIssue(issueId, phaseId))
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
    <div className='issue-ellipsis-outter'>
      <div className='issue-delete-container' onClick={handleIssueDelete}><i className="fa-solid fa-xmark"></i></div>
      {/* <div className='issue-ellipsis-container' onClick={openMenu} ><i className="fa-solid fa-ellipsis"></i></div>
        {showMenu && <div className='issue-delete-container'>
        <div className='issue-ellipsis-dropDown' onClick={handleIssueDelete}>DELETE</div>
        <div className='issue-ellipsis-dropDown'><UpdateIssueModal/></div>
        </div> */}
    </div>
  )
}

export default DeleteIssue;

import React, { useEffect, useState } from 'react';
import { thunkDeleteIssue } from '../../store/issue';
import { usehistory, useDispatch } from "react-redux"
import { thunkGetAllPhasesIssues } from '../../store/issue';
import '../CSS/DeleteIssues.css'

const DeleteIssue = ({issueId, phaseId}) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState();
  console.log("DELETE ISSUE---phaseId:", phaseId)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true)
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    }

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu])

  const handleIssueDelete = async () => {
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
    <div>
      <div className='issue-ellipsis-container' onClick={openMenu} ><i className="fa-solid fa-ellipsis"></i></div>
      <div>
        {showMenu && <>
        <div onClick={handleIssueDelete}>DELETE</div>
        </>}
      </div>
    </div>
  )
}

export default DeleteIssue;

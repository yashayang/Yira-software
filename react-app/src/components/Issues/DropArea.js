import React, { useState } from 'react';
import '../CSS/DropArea.css';

const DropArea = ({ onDrop, phaseName, index}) => {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <section
      onDragEnter={()=> setShowDrop(true)}
      onDragLeave={()=> setShowDrop(false)}
      onDrop={(e) => {
        console.log("DropArea ---- onDropEVENT:", phaseName, index)
        onDrop(phaseName, index);
        setShowDrop(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      className={showDrop ? "drop-area" : "hide-drop-area"}
    >
      Drop Here
    </section>
  )
}

export default DropArea;

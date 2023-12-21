import React from "react";

const Popup = (props) => {
  const { setModal, post } = props;
  return (
    <div
      onClick={() => {
        setModal(false);
      }}
      className="popup-container"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setModal(true);
        }}
        className="popup-div"
      >
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    </div>
  );
};

export default Popup;

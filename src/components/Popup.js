import React from "react";

const Popup = (props) => {
  const { setModal } = props;
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
        <button
          onClick={(e) => {
            // e.stopPropagation();
            setModal(true);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;

import React from "react";

const Alert = ({ message, className }) => {

    return (
        <>
            <div
                className={`m-4 px-4 py-2 rounded-md text-white text-center ${className}`}
            >
                {message}
            </div>
        </>
    );
};

export default Alert;

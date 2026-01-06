import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Form() {
  return (
    <>
      <h4 style={{color: "white"}}>If Google form is not visible, click 
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSc6VAXb7Fz3GCzU-cL9NRCldbNfQ3-_EWGBGUnGVJkbcRloRQ/closedform?embedded=true">link</a></h4>
      <iframe
        title="Google Form"
        src="https://docs.google.com/forms/d/e/1FAIpQLSc6VAXb7Fz3GCzU-cL9NRCldbNfQ3-_EWGBGUnGVJkbcRloRQ/closedform?embedded=true"
        width="100%"
        height="800"
        style={{ border: "0" }}
      >
      Loading…
    </iframe>
    </>
    
  );
}

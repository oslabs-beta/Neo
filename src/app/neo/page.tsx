import Link from "next/link";
'use client';

export default function Neo() {

  //tester function that triggers on any changes that occur in the input field
  function test() {
    //set variable equal to files array on file upload element
    const upload: HTMLElement | Array<any> | null = document.getElementById('fileInput').files;
    //if variable is not null and contains files
    if(upload && upload.length !== 0) {
      console.log('File uploaded: ', upload);
    } else {
      console.log('Nothing loaded');
    }
  };

  return (
    <>
      <div id="content">
        <h1>Neo Test</h1>
      </div>
    </>
  )
}
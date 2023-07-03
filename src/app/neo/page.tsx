import Link from "next/link";
'use client';

export default function Neo() {

  //FORM DATA CREATION FUNCTION
  function createFormData(fileElement: HTMLElement) {
    let files = Array.from(fileElement.files)
    let formData = new FormData();
    files.forEach((file: any) => {
      formData.append('file', file);
    })
    return formData;
  }

  //FUNCTION TRIGGER ON ELEMENT CHANGE
  async function test() {

    //GET CONTENTS OF FILE LOAD
    const upload: HTMLElement | Array<any> | null = document.getElementById('fileInput');

    //IF FILES LOADED
    if(upload && upload.length !== 0) {
      //test logs
      console.log('File uploaded: ', upload.files);
      console.log('File 1: ', upload.files['0']['name']);
      console.log('type of object: ', Array.isArray(upload));
      //Create form data from upload
      const newFormData = createFormData(upload);
    } 

    //NO FILE LOADED
    else {
      console.log('Nothing loaded');
    }
  };

  //TEST FOR GET REQUESTS TO API
  async function test2() {
    console.log('in test');
    let response: any = await fetch('http://localhost:3000/api/fileUpload')
    response = await response.json();
    console.log('reponse from server: ', response);
    return response;
  }

  return (
    <>
      <div id="content">
        <h1>Neo Test</h1>
        <input id="fileInput" type="file" onChange={ test } webkitdirectory="true" multiple/* multiple attr allows for multiple directory upload */></input>
        <button onClick={ test2 }>I am button, push me for test</button>
      </div>
    </>
  )
}
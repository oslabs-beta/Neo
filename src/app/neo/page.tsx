import Link from "next/link";
'use client';
import axios from 'axios';

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
    //Retreive uploaded files
    const upload: HTMLElement | Array<any> | null = document.getElementById('fileInput');
    //check if files loaded
    if(upload && upload.length !== 0) {
      //Create form data from upload
      const newFormData = createFormData(upload);
      //send form data to server
      const response = axios.post('http://localhost:3000/api/fileUpload', newFormData, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      })
        .catch((err: Error) => console.error('An error occured when making a post request for file upload: ', err))
      console.log('File saved to disk');
    } else {
      console.error('No file uploaded');
    }
  };

  return (
    <>
      <div id="content">
        <h1>Neo Test</h1>
        <input id="fileInput" type="file" onChange={ test } webkitdirectory="true" multiple/* multiple attr allows for multiple directory upload */></input>
      </div>
    </>
  )
}
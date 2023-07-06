import Link from "next/link";
'use client';
import axios from 'axios';
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Neo() {

  /*FORM DATA CREATION FUNCTION*/
  // function createFormData(fileElement: any) {
  //   let files: any[] = Array.from(fileElement.files)
  //   let formData = new FormData();
  //   const pathing: string[] = [];
  //   files.forEach((file: any) => {
  //     formData.append('file', file);
  //     pathing.push(file.webkitRelativePath);
  //   })
  //   console.log('formData before return', formData)
  //   return [formData, pathing];
  // }

  /*FORM DATA FUNCTION ON ELEMENT CHANGE*/
  // async function test(event: any) {
  //   console.log('uploaded filed', event.target.files);
  //   //Retreive uploaded files
  //   const upload: any = document.getElementById('fileInput');
  //   //check if files loaded
  //   if (upload && upload.length !== 0) {
  //     //Create form data from upload
  //     const [formData, pathing] = createFormData(upload);
  //     console.log('testing the objects', formData, pathing)
  //     // Make axios post request sending form data
  //     await axios.post('http://localhost:3000/api/fileUpload', formData)
  //       .catch((err: Error) => console.error('An error occured when making a post request for file upload: ', err))
  //     console.log('Post request complete'); 
  //   } else {
  //     console.error('No file uploaded');
  //   }
  // };


  /*FILE ZIP FUNCTION TO RUN ONCHANGE*/
  async function createZip (event: any) {
    const files: any = event.target.files
    const zip = new JSZip()
    //packet all the files
    for(const file of files) {
      console.log(file);
      zip.file(file.name, file, { createFolders: true });
    }
    //convert to blob
    const blobZip = await zip.generateAsync({type: "blob"})
    console.log('check blobZip: ', blobZip);
    //append to file
    const blobForm = new FormData()
    blobForm.append('zip', blobZip, "Blob")
    console.log('check blobForm: ', blobForm.get('zip'));
    //send file to server
    await axios.post('http://localhost:3000/api/fileUpload', blobZip)
      .catch((err: Error) => console.error(err));
  }

  return (
    <>
    <div id="content" className="bg-gray-300 rounded-3xl">
      <div id="app-header" className="flex justify-between">
        <p className="text-3xl text-black ml-10">Dashboard</p>
        <input className="bg-black rounded-md p-2 mr-10" id="fileInput" type="file" name="directory" webkitdirectory="true" onChange={ createZip } ></input>
      </div>
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div id="app-sidebar" className="flex flex-col ml-20 text-black">
          File.js
          <button className="bg-black rounded-md p-2 text-white">
            Add Folder
          </button>
        </div>
        <div id="app-body_line" className="bg-black"></div>
        <div
          id="app-main"
          className="flex flex-col justify-center text-black"
        >
          File.js
          <button className="bg-black rounded-md p-2 text-white">
            Generate
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

//ORIGINAL TEST CODE
/*
<div id="content">
<h1>Neo Test</h1>
<form method="POST" action="/api/fileUpload" encType="multipart/form-data">
  <input id="fileInput" type="file" name="directory" webkitdirectory="true" onChange={createZip} ></input>
  <input type="submit"></input>
</form>
*/

{
  /* <input id="fileInput" type="file" onChange={ test } webkitdirectory="true" multiple></input> */
}

//NOTES
/*
1. Attempt one set up form creating function with axios to send formdata created from file upload
  - Replaced with from data HTML creator with submit button
2. Attempt two building zip function to send zip file to server
New modules
1. axios - for streamlining server requests
2. jszip - for zipping uploads
*/


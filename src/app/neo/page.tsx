import Link from "next/link";
'use client';
import axios from 'axios';
import JSZip from "jszip";
import React, { useState } from 'react';

export default function Neo() {
  const [fileStructure, setFileStructure] = useState<null | Array<FileItem> | []>(null);

  // //FORM DATA CREATION FUNCTION
  // function createFormData(fileElement: any) {
  //   let files: any[] = Array.from(fileElement.files)
  //   let formData = new FormData();
  //   files.forEach((file: any) => {
  //     formData.append('file', file);
  //   })
  //   return formData;
  // }

  // //FORM DATA FUNCTION ON ELEMENT CHANGE
  // async function test() {
  //   //Retreive uploaded files
  //   const upload: any = document.getElementById('fileInput');
  //   console.log('test', upload)
  //   //check if files loaded
  //   if (upload && upload.length !== 0) {
  //     //Create form data from upload
  //     const newFormData = createFormData(upload);
  //     // Make axios post request sending form data with uploaded files
  //     const response = axios.post('http://localhost:3000/api/fileUpload', newFormData)
  //       .catch((err: Error) => console.error('An error occured when making a post request for file upload: ', err))
  //     console.log('Post request complete'); 
  //   } else {
  //     console.error('No file uploaded');
  //   }
  // };


  //FILE ZIP FUNCTION TO RUN ONCHANGE
  function createZip () {
    const filesInput: any = document.getElementById('fileInput');
    const files: any = filesInput.files
    const zip = new JSZip()


// CREATE ARRAY OF FILE ITEMS, FILTER PRIORITY
    const newFileStructure: Array<FileItem> = [];
    for (const file of files) {
      if (!file.webkitRelativePath.includes('node_modules') && 
      !file.webkitRelativePath.includes('webpack') &&
      !file.webkitRelativePath.includes('.next') &&
      !file.webkitRelativePath.includes('config') &&
      !file.webkitRelativePath.includes('.git') &&
      !file.type.includes('image')
      ) {
        // SEPARATE FOLDERS FROM FILES
        const filePath = file.webkitRelativePath;
        const filePathParts = filePath.split('/');
        const fileName = filePathParts.pop() as string;
        let currentFolder = newFileStructure;

        for (const folderName of filePathParts) {
          const existingFolder = currentFolder.find((item) => item.name === folderName);

          if (existingFolder && existingFolder.type === 'folder') {
            currentFolder = existingFolder.files as FileItem[];
          } else {
            const newFolder: FileItem = {
              name: folderName,
              type: 'folder',
              size: 0,
              lastModified: 0,
              files: [],
            };
            currentFolder.push(newFolder);
            currentFolder = newFolder.files as FileItem[];
          }
        }

        currentFolder.push({
          name: fileName,
          type: 'file',
          size: file.size,
          lastModified: file.lastModified,
        });

        console.log(file);
      }
    }

    setFileStructure(newFileStructure);
  }


  return (
    <>
    <div id="content" className="bg-gray-300 rounded-3xl">
      <div id="app-header" className="flex justify-between">
        <p className="text-3xl text-black ml-10">Dashboard</p>
        <input 
          className="bg-black rounded-md p-2 mr-10 text-white" 
          id="fileInput" 
          type="file" 
          name="directory" 
          webkitdirectory="true" 
          onChange={createZip} 
        ></input>
      </div>
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div id="app-sidebar" className="flex flex-col ml-20 text-black">
          {fileStructure && <FileItem item={fileStructure} />}
          {/* <button className="bg-black rounded-md p-2 text-white">
            Add Folder
          </button> */}
        </div>
        <div id="app-body_line" className="bg-black"></div>
        <div
          id="app-main"
          className="flex flex-col justify-center text-black"
        >

          <button className="bg-black rounded-md p-2 text-white">
            Generate
          </button>
        </div>
      </div>
    </div>
    </>
  );

  type FileItem = {
    name: string;
    type: 'file' | 'folder';
    size: number;
    lastModified: number;
    files?: FileItem[];
  };

  function FileItem({
    item, onClick,
  }: {
    item: FileItem[];
    onClick: (folderName: string) => void;
  }) {
    const handleClick = (folderName: string) => {
      onClick(folderName);
    };

    return (
      <ul>
        {item.map((file) => (
          <li key={file.name}>
            {file.type === 'file' ? (
              <span>{'__' + file.name}</span>
            ) : (
              <strong onClick={() => handleClick(file.name)}>{'/' + file.name}</strong>
          )}
          {file.files && <FileItem item={file.files} onClick={onClick} />}
        </li>
      ))}
    </ul>
  );
}
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
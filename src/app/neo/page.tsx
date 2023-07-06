import Link from "next/link";
'use client';
import axios from 'axios';
import JSZip from "jszip";

export default function Neo() {

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
    //send blob to server
    await axios.post('http://localhost:3000/api/fileUpload', blobZip)
      .then(res =>  console.log(res))
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
};


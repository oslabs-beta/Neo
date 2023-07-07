'use client';
import { useState } from 'react';
import Donut from './donut';
import DoughnutChart from './donut';
import axios from 'axios';
import JSZip from 'jszip';

export default function App() {
  const [data, setData] = useState([50, 50]);
  const [fileStructure, setFileStructure] = useState<null | Array<FileItem> | []>(null);


  //FILE ZIP FUNCTION TO RUN ONCHANGE
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



    // CREATE ARRAY OF FILE ITEMS, FILTER PRIORITY
    const newFileStructure: Array<FileItem> = [];
    for (const file of files) {
      if (!file.webkitRelativePath.includes('node_modules') &&
        !file.webkitRelativePath.includes('webpack') &&
        !file.webkitRelativePath.includes('.next') &&
        !file.webkitRelativePath.includes('config') &&
        !file.webkitRelativePath.includes('.git') &&
        !file.name.includes('env.d') &&
        !file.name.includes('README') &&
        !file.name.includes('package-lock') &&
        !file.name.includes('eslintrc') &&
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

  // END OF CREATE ZIP FUNCTION

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
              <span className="ml-3">{file.name}</span>
            ) : (
              <strong onClick={() => handleClick(file.name)}>{'/' + file.name}</strong>
            )}
            {file.files && <FileItem item={file.files} onClick={onClick} />}
          </li>
        ))}
      </ul>
    );
  }
  
  
  return (
    <div id="content" className="bg-gray-300 rounded-3xl">
      <div id="app-header" className="flex justify-between">
        <p className="text-3xl text-black ml-10">Dashboard</p>
        {/* <button className="bg-black rounded-md p-2 mr-10">Upload File</button> */}
        <input
          className="bg-black rounded-md p-2 mr-10 text-white"
          id="fileInput"
          type="file"
          name="directory"
          webkitdirectory="true"
          onChange={ createZip }
        ></input>
      </div>
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div id="app-sidebar" className="flex flex-col ml-10 pb-10 w-[20%] text-black max-h-[65vh] overflow-auto">
          {fileStructure && <FileItem item={fileStructure} />}
          {/* <button className="bg-black rounded-md p-2 text-white">
            Add Folder
          </button> */}
        </div>
        <div id="app-body_line" className="bg-black"></div>
        <div id="app-main" className="flex flex-col justify-center text-black mx-8 my-5">
          File.js
          <div className="flex h-1/3">
            <Donut donutData={data} idx={1} />
          </div>
          <div className="flex h-1/4">
            <Donut donutData={data} idx={2} />
            <Donut donutData={data} idx={3} />
            {/* <Donut donutData={data} idx={4} /> */}
            {/* <Donut donutData={data} idx={5} /> */}
          </div>
          <button
            className="bg-black rounded-md p-2 text-white"
            onClick={() => setData([70, 30])}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )

}

/*
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
          </button> }
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

*/
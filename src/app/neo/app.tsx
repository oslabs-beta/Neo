'use client';
import { useState, useEffect } from 'react';
import Donut from './donut';
import DoughnutChart from './donut';
import axios from 'axios';
import JSZip from 'jszip';

export default function App() {
  const [data, setData] = useState([50, 50]);
  const [fileStructure, setFileStructure] = useState<null | Array<FileItem> | []>(null);
  const [chartVision, setChartVision] = useState(false);
  const [nameDisplay, setNameDisplay] = useState('')

  const handleGen = async (e: any) => {
    try {
      const response = await fetch('http://localhost:9411/api/v2/traces?serviceName=next-app&spanName=loadcomponents.loadcomponents&limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      type objectArrArr = Record<string, string | number>[][];
      const data: objectArrArr = await response.json()
      console.log(data);
      const arr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j].name === 'loadcomponents.loadcomponents') {
            arr.push(data[i][j].duration)
          }
        }
      }
      console.log(arr);
    } catch (error) {
      console.log('Error', error)
    }
    setChartVision(true);
    setData([70, 30])
  }

  useEffect(() => {
    const allCharts = document.getElementById('all-charts')
    if (chartVision === true) {
      (allCharts as HTMLElement).removeAttribute('hidden')
    } else {
      allCharts?.setAttribute('hidden', 'true')
    }
  }, [chartVision])

  //FILE ZIP FUNCTION TO RUN ONCHANGE
  async function createZip(event: any) {
    const newFileStructure: Array<FileItem> = [];
    const files: any = event.target.files
    const zip = new JSZip()
    //packet all the files
    for (const file of files) {
      //add file to zip
      if (
        !file.webkitRelativePath.includes('node_modules') &&
        !file.webkitRelativePath.includes('.next')
      ) {
        const pathing = `${file.webkitRelativePath}`.slice(0, file.webkitRelativePath.length - file.name.length - 1);
        zip.folder(pathing)?.file(file.name, file);
      }
      //filter through file types
      if (!file.webkitRelativePath.includes('node_modules') &&
        !file.webkitRelativePath.includes('webpack') &&
        !file.webkitRelativePath.includes('.next') &&
        !file.webkitRelativePath.includes('config') &&
        !file.webkitRelativePath.includes('.git') &&
        !file.webkitRelativePath.includes('zip') &&
        !file.name.includes('env.d') &&
        !file.name.includes('README') &&
        !file.name.includes('package-lock') &&
        !file.name.includes('eslintrc') &&
        !file.type.includes('image') &&
        !file.name.startsWith('.')
      ) {
        // SEPARATE FOLDERS FROM FILES
        const filePath = file.webkitRelativePath;
        const filePathParts = filePath.split('/');
        const fileName = filePathParts.pop() as string;
        let currentFolder = newFileStructure;
        console.log(file);

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
              path: '',
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
          path: filePath,
        });
        //File test
        // console.log(file);
      }
    }
    //Create styling
    setFileStructure(newFileStructure);
    //convert to blob
    const blobZip = await zip.generateAsync({ type: "blob" })
    // console.log('check blobZip: ', blobZip);
    //send blob to server
    await axios.post('/api/fileUpload', blobZip)
      .then(res => console.log(res))
      .catch((err: Error) => console.error(err));
  }

  // END OF CREATE ZIP FUNCTION

  type FileItem = {
    name: string;
    type: 'file' | 'folder';
    size: number;
    lastModified: number;
    files?: FileItem[];
    path: string;
  };

  function FileItem({
    item, onClick,
  }: {
    item: FileItem[];
    onClick: (folderName: string) => void;
  }) {
    const handleClick = (folderName: string) => {
      setNameDisplay(folderName)
      console.log(folderName)
    };

    return (
      <ul>
        {item.map((file) => (
          <li key={file.name} className="directoryBox">
            {file.type === 'file' ? (
              <span className="ml-3 directoryItem"
                onClick={() => handleClick(file.path)}>{file.name}</span>
            ) : (
              <strong
                className="directoryItem"
                onClick={() => handleClick('/' + file.name)} >{'/' + file.name}</strong>
            )}
            {file.files && <FileItem item={file.files} onClick={onClick} />}
          </li>
        ))}
      </ul>
    );
  }

  //FileItem onClick placeholder
  const func = (str: string) => str + 'dog';


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
          onChange={createZip}
          webkitdirectory='true'
          directory='true'
          mozdirectory='true'
        ></input>
      </div>
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div id="app-sidebar" className="flex flex-col ml-10 pb-10 w-[20%] text-black max-h-[65vh] overflow-auto">
          {fileStructure && <FileItem item={fileStructure} onClick={func} />}
          {/* <button className="bg-black rounded-md p-2 text-white">
            Add Folder
          </button> */}
        </div>
        <div id="app-body_line" className="bg-black"></div>
        <div id="app-main" className="flex flex-col justify-center items-center text-black mx-8 my-5">
          {nameDisplay}
          <div id="all-charts" hidden>
            <div id="overall-donut" className='flex justify-center items-center'>
              <Donut donutData={data} idx={1} donutName={'Overall Score'} csize={250} />
            </div>
            <div id="technical-donuts" className='flex my-10'>
              <Donut donutData={data} idx={2} donutName={'Performance'} csize={150} />
              <Donut donutData={data} idx={3} donutName={'Indexability'} csize={150} />
              <Donut donutData={data} idx={4} donutName={'URL Quality'} csize={150} />
              <Donut donutData={data} idx={5} donutName={'Markup Validity'} csize={150} />
            </div>
          </div>
          <div className='flex'>
            <button
              className="bg-black rounded-md p-2 mt-5 mr-5 text-white"
              onClick={handleGen}
            >
              Generate
            </button>
            <button
              className="bg-black rounded-md p-2 mt-5 ml-5 text-white"
              onClick={() => {
                setNameDisplay('');
                setChartVision(false)
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

//Fix input directory attributes
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
    mozdirectory?: string;
  }
}
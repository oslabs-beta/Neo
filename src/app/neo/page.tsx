import Link from 'next/link';
import { VictoryPie } from 'victory';
// ('use client');

export default function Neo() {
  // //tester function that triggers on any changes that occur in the input field
  // function test() {
  //   //set variable equal to files array on file upload element
  //   const upload: HTMLElement | Array<any> | null = document.getElementById('fileInput').files;
  //   //if variable is not null and contains files
  //   if(upload && upload.length !== 0) {
  //     console.log('File uploaded: ', upload);
  //   } else {
  //     console.log('Nothing loaded');
  //   }
  // };

  return (
    <>
      <div id="content" className="bg-gray-300 rounded-3xl">
        <div id="app-header" className="flex justify-between">
          <p className="text-3xl text-black ml-10">Dashboard</p>
          <button className="bg-black rounded-md p-2 mr-10">Upload File</button>
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
            <VictoryPie
              data={[
                { x: 'Green', y: 70 },
                { x: 'White', y: 30 },
              ]}
              colorScale={['green', 'white']}
            />
            <button className="bg-black rounded-md p-2 text-white">
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <input id="fileInput" type="file" onChange={ test } webkitdirectory="true" multiple></input> */
}

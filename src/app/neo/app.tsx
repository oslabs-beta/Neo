'use client';
import { useState, useEffect, Dispatch } from 'react';
import Donut from './donut';
import DoughnutChart from './donut';
import axios from 'axios';
import JSZip from 'jszip';
import Input from './input';
import { useSession } from 'next-auth/react';
import ClearTree from './clear-tree';
import { Overlock } from 'next/font/google';

export default function App() {
  const [data, setData] = useState([[], [50, 50]]);
  const [scores, setScores] = useState(['0']);
  const [donutColor, setDonutColor] = useState(['white']);
  const [donutMetrics, setDonutMetrics] = useState([0, 0, 0, 0]);
  const [fileStructure, setFileStructure] = useState<
    null | Array<FileItem> | []
  >(null);
  const [chartVision, setChartVision] = useState(false);
  const [inputOption, setInputOption] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('checking files');
  const [nameDisplay, setNameDisplay] = useState('');
  const [port, setPort] = useState(0);
  const [appName, setAppName] = useState('');
  const [clearTreeOption, setClearTreeOption] = useState(false);

  const handleGen = async (e: any) => {
    // this is the fetch request for NEO's OpenTelemetry data
    // try {
    //   const response: Response = await fetch('http://localhost:9411/api/v2/traces?serviceName=next-app&spanName=loadcomponents.loadcomponents&limit=10', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    //   );
    //   type parsedDataType = Record<string, string | number>[][];
    //   const data: parsedDataType = await response.json()
    //   console.log(data);
    //   const arr = [];
    //   for (let i = 0; i < data.length; i++) {
    //     for (let j = 0; j < data[i].length; j++) {
    //       if (data[i][j].name === 'loadcomponents.loadcomponents') {
    //         arr.push(data[i][j].duration)
    //       }
    //     }
    //   }
    //   console.log(arr);
    // } catch (error) {
    //   console.log('Error', error)
    // }
    setChartVision(true);
    // setData([70, 30])
  };

  useEffect(() => {
    const allCharts: HTMLElement | null = document.getElementById('all-charts');
    if (chartVision === true) {
      (allCharts as HTMLElement).removeAttribute('hidden');
    } else {
      allCharts?.setAttribute('hidden', 'true');
    }
  }, [chartVision]);

  async function removeFiles(event: any) {
    setClearTreeOption(false);
    setFileStructure([]);
    await axios
      .get('http://localhost:3000/api/cleanUp')
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  const { data: session } = useSession();

  //FILE ZIP FUNCTION TO RUN ONCHANGE
  async function createZip(event: any) {
    setInputOption(false);
    const newFileStructure: Array<FileItem> = [];
    const files: any = event.target.files;
    const zip = new JSZip();
    //packet all the files
    setUpdateMessage('Zipping Files');
    for (const file of files) {
      //Conditional ignore for zip file
      if (
        file.webkitRelativePath &&
        !file.webkitRelativePath.includes('node_modules') &&
        !file.webkitRelativePath.includes('.next')
      ) {
        const pathing = `${file.webkitRelativePath}`.slice(
          0,
          file.webkitRelativePath.length - file.name.length - 1
        );
        //add folder or file to zip
        zip.folder(pathing)?.file(file.name, file);
      }
      //filter through file types
      if (
        file.webkitRelativePath &&
        !file.webkitRelativePath.includes('node_modules') &&
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
        setAppName(filePathParts[0]);
        const fileName = filePathParts.pop() as string;
        let currentFolder = newFileStructure;
        console.log(file);

        for (const folderName of filePathParts) {
          const existingFolder = currentFolder.find(
            (item) => item.name === folderName
          );

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
    //convert to blob
    const blobZip = await zip.generateAsync({ type: 'blob' });
    // console.log('check blobZip: ', blobZip);
    //send blob to server
    setUpdateMessage('Sending Files to Server');
    await axios
      .post(`/api/fileUpload?email=${session?.user?.email}`, blobZip)
      .then((res) => {
        console.log('response from file upload', res);
        // set port
        setPort(res.data.port);
        setUpdateMessage('Files Uploaded to Server');
        setTimeout(() => setInputOption(true), 1000);
      })
      .catch((err: Error) => {
        console.error('error from file upload', err);
        setUpdateMessage('An Error Occurred');
        setTimeout(() => setInputOption(true), 1000);
      });
    setUpdateMessage('Building Tree');
    setFileStructure(newFileStructure);
    setClearTreeOption(true);
  }

  // console log new port
  useEffect(() => {
    console.log(`${session?.user?.name}'s new port is ${port}`);
  }, [port]);

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
    item,
    onClick,
  }: {
    item: FileItem[];
    onClick: (folderName: string) => void;
  }) {
    const handleClick = async (folderName: string) => {

      try {
        if (folderName[0] === '/') {

          if (folderName === '/app') folderName = '/';
          else if (folderName === '/src')
            throw new Error(
              'src is not a valid input, please try a page within the Next app'
            );
          else if (folderName === '/' + appName)
            throw new Error(
              `Your App Name '${appName}' is not a valid input, please try a page within the Next app`
            );

          setNameDisplay('/' === folderName ? 'Home Page' : folderName.slice(1));
          console.log(folderName);

          console.log('appname: ', appName);
          const body = { port, endpoint: folderName };
          const res = await axios.post('/api/puppeteerHandler', body);
          const fcpScore = parseInt(res.data.metrics.FCPScore); // data[1]
          const domScore = parseInt(res.data.metrics.domScore); // data[2]
          const reqScore = parseInt(res.data.metrics.RequestScore); // data[3]
          const hydScore = parseInt(res.data.metrics.HydrationScore); // data[4]

          let overall = 0;
          let count = 0;
          if (hydScore) {
            count++;
            overall += hydScore;
          }
          if (fcpScore) {
            count++;
            overall += fcpScore;
          }
          if (domScore) {
            count++;
            overall += domScore;
          }
          if (reqScore) {
            count++;
            overall += reqScore;
          }
          const overallScore = overall / count;
          setData([
            [overallScore, 100 - overallScore],
            [fcpScore, 100 - fcpScore],
            [domScore, 100 - domScore],
            [reqScore, 100 - reqScore],
            [hydScore, 100 - hydScore],
          ]);
          setScores([
            +overallScore.toFixed(2),
            res.data.metrics.FCPScore,
            res.data.metrics.domScore,
            res.data.metrics.RequestScore,
            res.data.metrics.HydrationScore,
          ]);
          let overallColor = 'green';
          if (overallScore < 70 && overallScore > 50) {
            overallColor = 'yellow';
          } else if (overallScore <= 50) {
            overallColor = 'red';
          }
          setDonutColor([
            overallColor,
            res.data.metrics.FCPColor,
            res.data.metrics.domColor,
            res.data.metrics.RequestColor,
            res.data.metrics.HydrationColor,
          ]);
          setDonutMetrics([
            res.data.metrics.FCPNum,
            res.data.metrics.RequestNum,
            res.data.metrics.domCompleteNum,
            res.data.metrics.HydrationNum,
          ]);
        }
      } catch (error) {
        console.error('Error in Axios Request to Puppeteer');
        alert(error);
      }
    };
    return (
      <ul id="fileStructure">
        {item.map((file) => (
          <li key={file.name} className="directoryBox">
            {file.type === 'file' ? (
              <span
                className="ml-3 directoryItem"
                onClick={() => handleClick(file.path)}
              >
                {file.name}
              </span>
            ) : (
              <strong
                className="directoryItem"
                onClick={() => handleClick('/' + file.name)}
              >
                {'/' + file.name}
              </strong>
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
        <Input
          createZip={createZip}
          inputOption={inputOption}
          updateMessage={updateMessage}
        />
      </div>
      <div id="app-header_line" className="bg-black rounded-xl"></div>
      <div id="app-body" className="flex">
        <div
          id="app-sidebar"
          className="flex flex-col ml-10 pb-10 w-[20%] text-black max-h-[65vh] overflow-auto"
        >
          <ClearTree
            removeFiles={removeFiles}
            clearTreeOption={clearTreeOption}
          />
          {fileStructure && <FileItem item={fileStructure} onClick={func} />}
          {/* <button className="bg-black rounded-md p-2 text-white">
            Add Folder
          </button> */}
        </div>
        <div id="app-body_line" className="bg-black"></div>
        <div
          id="app-main"
          className="flex flex-col justify-center items-center text-black mx-8 my-5 grow"
        >
          {nameDisplay}
          <div id="all-charts" hidden>
            <div
              id="overall-donut"
              className="flex justify-center items-center"
            >
              <Donut
                donutData={data[0]}
                idx={1}
                donutName={'Overall Score'}
                csize={250}
                overallScore={scores[0]}
                color={donutColor[0]}
              />
            </div>
            <div id="technical-donuts" className="flex flex-wrap min-w-fit justify-around my-10">
              <Donut
                donutData={data[1]}
                idx={2}
                donutName={'First Contentful Paint'}
                csize={150}
                overallScore={scores[1]}
                color={donutColor[1]}
              />
              <Donut
                donutData={data[2]}
                idx={3}
                donutName={'DOM Completion'}
                csize={150}
                overallScore={scores[2]}
                color={donutColor[2]}
              />
              <Donut
                donutData={data[3]}
                idx={4}
                donutName={'Request Time'}
                csize={150}
                overallScore={scores[3]}
                color={donutColor[3]}
              />
              <Donut
                donutData={data[4]}
                idx={5}
                donutName={'Hydration Time'}
                csize={150}
                overallScore={scores[4]}
                color={donutColor[4]}
              />
            </div>
            <div className="metricsBox flex justify-between items-center">
              <div>{'FCP: ' + donutMetrics[0] + ' ms'}</div>

              <div>{'DC: ' + donutMetrics[1] + ' ms'}</div>

              <div>{'RT: ' + donutMetrics[2] + ' ms'}</div>

              <div>{'HT: ' + donutMetrics[3] + ' ms'}</div>
            </div>
          </div>
          {port !== 0 && nameDisplay !== '' ?
            (<div className="flex">
              <button
                id="handleGen"
                className="bg-black rounded-md p-2 mt-5 mr-5 text-white"
                onClick={handleGen}
              >
                Generate
              </button>
              <button
                id="reset"
                className="bg-black rounded-md p-2 mt-5 ml-5 text-white"
                onClick={() => {
                  setNameDisplay('');
                  setChartVision(false);
                }}
              >
                Reset
              </button>
            </div>) : (port === 0 ? (
              <div className='flex justify-center items-center'>
                <p>Please Upload Your Next JS App</p>
              </div>
            ) : (
              <div>
                Please Choose a Page on Your Next JS App
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
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

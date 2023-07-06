'use client';
import { useState } from 'react';
import Donut from './donut';
import DoughnutChart from './donut';

export default function App() {
  const [data, setData] = useState([50, 50]);

  return (
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
        <div id="app-main" className="flex flex-col justify-center text-black">
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
  );
}

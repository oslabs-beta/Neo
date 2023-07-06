import Link from 'next/link';
import DoughnutChart from './donut';
import App from './app';

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
    <div>
      <App />
    </div>
  );
}

{
  /* <input id="fileInput" type="file" onChange={ test } webkitdirectory="true" multiple></input> */
}

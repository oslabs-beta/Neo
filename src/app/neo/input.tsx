type inputProps = {
  createZip: any;
  inputOption: any;

}

export default function Input ({ createZip, inputOption }: inputProps) {
  if(inputOption) {
    return(
      <input
      className="bg-black rounded-md p-2 mr-10 text-white"
      id="fileInput"
      type="file"
      name="directory"
      onChange={ createZip }
      webkitdirectory='true'
      directory='true'
      mozdirectory = 'true'
      ></input> 
    )
  }
  else {
    return (
      <div className="bg-black rounded-md p-2 mr-10 text-white">I&APOSm a place holder</div>
    )
  }
  }
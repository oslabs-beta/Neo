type inputProps = {
  createZip: (event: any) => void;
  inputOption: boolean;
  updateMessage: string;
}

export default function Input ({ createZip, inputOption, updateMessage }: inputProps) {

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
      <div className="bg-black rounded-md p-2 mr-10 text-white">
        { updateMessage }
      </div>
    )
  }
  }
  // gradient-to-r from- from-${loadBar}% to-black to-${100 - loadBar}%
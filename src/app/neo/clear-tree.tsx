type clearTreeProps = {
  removeFiles: (event: any) => void;
  clearTreeOption: boolean;
}

export default function ClearTree ({ removeFiles, clearTreeOption }: clearTreeProps) {
  if(clearTreeOption) {
    return(
      <button id="delete-button" className="font-extrabold" onClick={removeFiles}>Clear Tree</button>
    )
  } else {
    return(
      <></>
    )
  }
}
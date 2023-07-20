/* Component for clear tree button for clearing out uploaded files and display tree */

type clearTreeProps = {
  removeFiles: (event: any) => void;
  clearTreeOption: boolean;
}

//switch based on clearTreeOption state in /neo/app.tsx
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
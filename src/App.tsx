import "./App.css"
import { useContext, useEffect, useState } from 'react';
import GCMapContainer from "./Components/GCMap/GCMapContainer";
import Login from "./Components/Login/Login";
import { Button } from "@mui/material";
import { SignalRContext } from "./Components/Contexts/SignalRContext";

function App() {
  const [tmp, setTmp] = useState(false)
  const conn = useContext(SignalRContext);

  useEffect(() => {
    conn.start()
    .then(() => {console.log("Connection Created")})
    .catch((err) => {console.error(err as Error)});

    return (() => {
      conn.stop()
    })
  });

  return (
    <div className="App">
      <SignalRContext.Provider value={conn}>
        {tmp ? <GCMapContainer/> : <Login/>}
      </SignalRContext.Provider>
      <Button onClick={() => {setTmp(!tmp)}}>Toggle</Button>
    </div>
  );
}

export default App;

import "./App.css"
import { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import GCMapContainer from "./Components/GCMap/GCMapContainer";
import Login from "./Components/Login/Login";

function App() {
  
  const [connection, setConnection] = useState<signalR.HubConnection>();

  useEffect(() => {
    const c = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl("https://localhost:7032/gamehub", {withCredentials: false})
      .build();
    //setConnection(c);
  }, [])

  useEffect(() => {
    if(connection) {
      connection.start()
      .then(() => {console.log("Connection Created")})
      .catch((err) => {console.error(err as Error)});
    }

    return (() => {
      connection?.stop();
    })
  }, [connection])

  return (
    <div className="App">
      {/* <GCMapContainer/> */}
      <Login/>
    </div>
  );
}

export default App;

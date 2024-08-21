import React, { useEffect, useState } from 'react';
import './App.css';
import * as signalR from "@microsoft/signalr";
import GCMap from './GCMap/GCMap';

function App() {
  
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [messages, setMessages] = useState("");

  useEffect(() => {
    const c = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl("http://localhost:5073/chatHub", {withCredentials: false})
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
  
  function onChatboxKeyUp(event: KeyboardEvent) {
    if(event.key === "Enter") {
      connection?.invoke("SendMessage", "viper", event.returnValue);
    }
  }

  return (
    <div className="App">
      <GCMap/>
    </div>
  );
}

export default App;

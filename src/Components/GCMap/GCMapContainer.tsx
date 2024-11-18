import "./GCMapContainer.css";
import GCMap from "./GCMap";
import { Button } from "@mui/material";
import { useContext } from "react";
import { SignalRContext } from "../Contexts/SignalRContext";
import { HubConnectionState } from "@microsoft/signalr";



function GCMapContainer() {

    const conn = useContext(SignalRContext)

    return (
        <div className="MapContainer">
            <div className="Map">
                <GCMap/>
            </div>
            <div className="SectorInfo">
                Sector Info
                <Button onClick={
                () => {
                    console.log("OnClick NetworkTest"); 
                    if(conn.state === HubConnectionState.Connected)
                        conn?.send("NetworkTest")
                    }}>
                    Network Test
                </Button>
                {/* <iframe src="https://tabletopadmiral.com/" height="100%" width="100%"/> */}
            </div>
        </div>
    );
}

export default GCMapContainer;
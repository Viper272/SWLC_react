import signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export default function useSignalR() { 
    const connection = useRef<signalR.HubConnection>();

    useEffect(() => {
        connection.current = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl("https://localhost:7032/gamehub", {withCredentials:false})
            .build();
    }, [])

    useEffect(() => {


        return (() => {
            connection.current?.stop();
        })
    })

    return connection;
}
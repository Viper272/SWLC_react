import * as signalR from "@microsoft/signalr";
import { createContext } from "react";


const conn = new signalR.HubConnectionBuilder()
.withAutomaticReconnect()
.withUrl("https://localhost:7032/gamehub", {withCredentials:false})
.build();

export const SignalRContext = createContext<signalR.HubConnection>(conn);
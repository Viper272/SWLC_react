import {Box, Button, TextField} from "@mui/material";
import '@fontsource/roboto/400.css';
import "./Login.css"
import { useContext, useState } from "react";
import { SignalRContext } from "../Contexts/SignalRContext";
import { HubConnectionState } from "@microsoft/signalr";

function Login() {
    const conn = useContext(SignalRContext);

    const [username, setusername] = useState("");

    return (
        <div className="Login">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <TextField id="textfield-username" 
                    label="Username" 
                    variant="outlined"
                    margin="normal"
                    onChange={(e) => setusername(e.target.value)}
                />
                <Button 
                    variant="contained"
                    onClick={() => onClick_Login()}
                >
                    Login
                </Button>
            </Box>
        </div>
    )


    function onClick_Login() {
        if(conn.state !== HubConnectionState.Connected) return;

        conn.send("playerLogin", username)
    }
}

export default Login;
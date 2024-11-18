import {Box, Button, TextField} from "@mui/material";
import '@fontsource/roboto/400.css';
import "./Login.css"

function Login() {

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
                />
                <Button 
                    variant="contained"
                    onClick={() => console.log("OnClick Login")}
                >
                    Login
                </Button>
            </Box>
        </div>
    )

}

export default Login;
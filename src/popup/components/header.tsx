import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';

export const Header : React.FC<{AppName : string}> = ({ AppName }) => {
    const summarizeClicked = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("Sending message to Background script to execute content script")
            chrome.runtime.sendMessage({
                action: "executeScript",
                tabId: tabs[0].id,
                file: 'contentScript.js'
            });
        });    
    }

    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {AppName}
                    </Typography>
                    <Button color="inherit" onClick={() => summarizeClicked()}>SUMMARIZE</Button>
                </Toolbar>
            </AppBar>
        </Box>);
}
import express from 'express';
import readline from 'readline';
import { WebSocketServer } from 'ws';
import fs from 'fs';

const app = express();
const PORT = 8080;
const filePath = 'log.txt';
let lines = [] // last 10 lines list

const server = app.listen(PORT, () => {
    console.log(`Server Connected to Port ${PORT}...`);
})

const wss = new WebSocketServer({server: server});

app.get('/', (req, res) => {
    res.send("Hello There");
})

const getlast10Lines = (ws) => {
    // if file already processed
    if(lines.length != 0) {
        ws.send(lines.join('<br/>'));
        return;
    }
    const file = readline.createInterface({
        input:fs.createReadStream(filePath)
    })
    file.on('line', (line) => {
        // console.log(line);
        lines.push(line);
    });
    file.on("close", () => {
        lines = lines.slice(-10);
        console.log(lines.length);
        ws.send(lines.join('<br/>'));
    })
}

const monitorFile = (ws) => {
    fs.watchFile(filePath, {
        interval: 1000,
      }, (curr, prev) => {
        console.log("\nThe file was edited");
        // Time when file was updated
        console.log("File was modified at: ", curr.size);
        if(curr.size > prev.size) {
            const createReader = fs.createReadStream(filePath, {start: prev.size});
            createReader.on('data', (data) => {
                // console.log(data.toString().split('\n'));
                let newLines = data.toString().split('\n');
                lines.push(...newLines); // updating lines with the updated changes
                console.log("last 10 lines ->", lines)
                lines = lines.slice(-10);
                ws.send(newLines.join('<br/>'));
            });
        }
      });
}

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    
    getlast10Lines(ws);
    monitorFile(ws);
    
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
    
    ws.on('close', () => {
        console.log('Connection closed..');
    });
});


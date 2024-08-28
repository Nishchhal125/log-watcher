# log-watcher

## Description
A log watcher like the "tail -f" UNIX command, where the file is on the same remote machine. 
The project has the following design:

1. A server program which monitors the given file and streams its updates. It runs on the same machine as the log file and it uses WebSockets to be able to push the file updates to the client(s).

2. Multiple web-based clients can print the updates of the file as they happen. Only the last 10 lines in the file are displayed when the page is loaded for every new client.

## Usage
First you only have to clone this repository:

```git clone https://github.com/Nishchhal125/log-watcher.git```

Then, install the dependencies (express & ws):

```npm install```

After that, run the server:

```node server```


Finally, open the public/index.html file in the browser.

You can update the log.txt file and watch the updates in the log file live in the browser.

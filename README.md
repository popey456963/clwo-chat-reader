# CLWO Chat Reader

> A wrapper around MyBB's DVZ shoutbox to allow access to chat logs via HTML request.

## Installation

```sh
$ git clone https://github.com/popey456963/clwo-chat-reader
$ cd clwo-chat-reader
$ npm i
$ npm start
```

## Usage

The API, by default, binds to :3040.  It contains the following endpoints:

 - `/get_comments?from=<from>` - Retrieve the past twenty comments from the specified `from` value or the latest twenty if not specified.

A web-socket address is also served via the same port which will stream new messages as they arrive.

## License

ISC © [popey456963](https://github.com/popey456963)

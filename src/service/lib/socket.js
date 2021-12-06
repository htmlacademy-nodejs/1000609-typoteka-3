'use strict';

const {Server} = require(`socket.io`);

const getSocket = (server) =>{
  return new Server(server, {
    cors: {
      origins: [`localhost:8080`],
      methods: [`GET`]
    }
  });
};

module.exports = getSocket;

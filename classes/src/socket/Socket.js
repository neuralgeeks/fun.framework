const R = require('ramda');
const autoBind = require('auto-bind');
const Logger = require('../../Logger');
const logger = new Logger();
const colors = {
  reset: '\x1b[0m',
  bgBroadcaster: '\u001b[44m'
};

const Broadcaster = require('./Broadcaster');

/**
 * @license
 * Copyright 2020 neuralgeeks LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The application WebSocket representation
 *
 * Currently only supports socket.io.
 */
class Socket {
  /**
   * Socket constructor, receives the socket.io server, the application broadcaster
   * and the application event catcher.
   *
   * @param {SocketIO.Server}  io           The application socket.io server.
   * @param {Broadcaster}      broadcaster  The application broadcaster.
   * @param {Catcher}          catcher      The application event catcher.
   *
   */
  constructor(io, broadcaster, catcher) {
    autoBind(this);

    this.broadcaster = broadcaster;
    // this.catcher = catcher;
    this.io = io;

    this.setup();
    this.broadcaster.set(io);
    // this.catcher.set(io);
  }

  /**
   * Setups the application socket interactions.
   */
  setup() {
    this.io.on('connection', (socket) => {
      logger.info(`Socket ${socket.id} has connected to server`);
      socket.on('subscribe-client', (data) => {
        this.setupBroadcaster(socket, data);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket ${socket.id} has disconnected from server`);
      });
    });
  }

  /**
   * Setups the application broadcasting interactions for a given socket.
   *
   * @param      {SocketIO.Socket}   socket  The given socket.
   * @param      {any}               data    The data that the socket sent at its connection.
   *
   */
  setupBroadcaster(socket, data) {
    R.forEach(async (channel) => {
      let evaluations = R.map((rule) => rule.eval(data), channel.rules);
      let results = await Promise.all(evaluations);
      let canJoin = R.reduce(R.and, true, results);

      if (canJoin) {
        let identity = await channel.identifier.resolveIdentity(data);

        // Joining to broadcast part of the channel
        socket.join(channel.name);

        // Joining to personal part of the channel
        if (identity !== '') socket.join(`${channel.name}${identity}`);

        logger.info(
          [
            `${colors.bgBroadcaster}BROADCASTER${colors.reset}`,
            `Socket ${socket.id} is joining ${channel.name} brodcaster channel`,
            identity !== ''
              ? `and ${channel.name}${identity} personal channel`
              : ''
          ].join(' ')
        );
      }
    }, this.broadcaster.channels());
  }
}

module.exports = Socket;

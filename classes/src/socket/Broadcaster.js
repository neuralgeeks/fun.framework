const R = require('ramda');
const Logger = require('../../Logger');
const logger = new Logger();
const colors = {
  reset: '\x1b[0m',
  bfBroadcaster: '\u001b[32;1m'
};

const BaseRule = require('../BaseRule');
const BaseIdentifier = require('../BaseIdentifier');

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
 * An application WebSocket Broadcaster representation
 */
class Broadcaster {
  /**
   * The socket.io instance of the application
   *
   * @type     {SocketIO.Server}
   */
  static io = null;

  /**
   * Sets the static value of the socket.io server.
   *
   * This method should be final
   *
   * @param      {SocketIO.Server}   io  The socket.io server
   */
  set(io) {
    Broadcaster.io = io;
  }

  /**
   * Returns the channels configurated for the application broadcaster.
   *
   * @returns    {{ name: string, rules: BaseRule[], identifier: BaseIdentifier }[]}   The configurated channels for the application.
   */
  channels() {
    return [];
  }

  /**
   * Returns if there's a configurated channel that matches the given name.
   *
   * This method should be final
   *
   * @param      {string}   name     The name to match
   * @returns    {boolean}           Whether or not there's a configurated channel that matches the given name.
   */
  searchChannel(name) {
    return R.find(R.propEq('name', name))(this.channels());
  }

  /**
   * Broadcasts an event with data to a channel given the channel name.
   *
   * This method should be final
   *
   * @param      {string}   to             The name of the channel to broadcast to.
   * @param      {string}   event          The name of the event to broadcast.
   * @param      {any}      data           The data of the event.
   * @param      {string}   [identifier]   The selected client identifier. Default is empty which means every client on the channel.
   */
  broadcast(to, event, data, identifier = '') {
    if (!Broadcaster.io) {
      logger.error(
        [
          `${colors.bfBroadcaster}BROADCASTER${colors.reset}`,
          'Could not broadcast data, io found undefined'
        ].join(' ')
      );
      return;
    }

    let exists = R.any((channel) => channel.name === to, this.channels());

    if (exists) {
      Broadcaster.io.to(`${to}${identifier}`).emit(event, data);
      logger.info(
        `${colors.bfBroadcaster}BROADCASTER${colors.reset} broadcasted:`
      );
      logger.info({
        channel: to,
        event,
        data,
        identifier
      });
    } else
      logger.error(
        [
          `${colors.bfBroadcaster}BROADCASTER${colors.reset}`,
          `Could not broadcast data, channel ${to} is not registered`
        ].join(' ')
      );
  }
}

module.exports = Broadcaster;

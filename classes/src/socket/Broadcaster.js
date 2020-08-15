const R = require('ramda');
const Logger = require('../../Logger');
const logger = new Logger();
const colors = {
  reset: '\x1b[0m',
  bfBroadcaster: '\u001b[32;1m'
};

const BaseRule = require('../BaseRule');

/**
 * An application WebSocket Broadcaster representation
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs Broadcaster
 */
class Broadcaster {
  /**
   * Validator human readable name
   *
   * @since    0.1.0
   * @access   public
   * @static
   *
   * @type     {SocketIO.Server}
   *
   * @member   {SocketIO.Server} io
   * @memberof Broadcaster
   */
  static io = null;

  /**
   * Sets the static value of the socket.io server.
   *
   * This method should be final
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Broadcaster
   *
   * @param      {SocketIO.Server}   io  The socket.io server
   */
  set(io) {
    Broadcaster.io = io;
  }

  /**
   * Returns the channels configurated for the application broadcaster.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Broadcaster
   *
   * @returns    {[{ name: string, rules: [BaseRule] }]}   The configurated channels for the application.
   */
  channels() {
    return [];
  }

  /**
   * Returns if there's a configurated channel that matches the given name.
   *
   * This method should be final
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Broadcaster
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
   * @since      0.1.0
   * @access     public
   * @memberof   Broadcaster
   *
   * @param      {string}   to      The name of the channel to broadcast to.
   * @param      {string}   event   The name of the event to broadcast.
   * @param      {any}      data    The data of the event.
   *
   * @returns    {void}
   */
  broadcast(to, event, data) {
    if (!Broadcaster.io)
      logger.error(
        colors.bfBroadcaster +
          'BROADCASTER' +
          colors.reset +
          ' Could not broadcast data, io found undefined'
      );

    let exist = R.any((channel) => {
      return channel.name == to;
    }, this.channels());

    if (exist) {
      Broadcaster.io.to(to).emit(event, data);
      logger.info(
        colors.bfBroadcaster + 'BROADCASTER' + colors.reset + ' broadcasted:'
      );
      logger.info({
        channel: to,
        event: event,
        data: data
      });
    } else
      logger.error(
        colors.bfBroadcaster +
          'BROADCASTER' +
          colors.reset +
          ' Could not broadcast data, channel ' +
          to +
          ' is not registered'
      );
  }
}

module.exports = Broadcaster;

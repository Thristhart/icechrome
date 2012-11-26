(function(exports) {
  /**
  * Creates an instance of the IRC client
  *
  * @param {String} host The remote host to connect to
  * @param {Number} port The port to connect to at the remote host
  * @param {Options} profile User information: nick, username, realname
  */
  function IRC(host, port, profile)
  {
    this.host = host;
    this.port = port;
    this.profile = profile;

    this._handlers = {};

    this._tcpClient = new TcpClient(host, port);
    
    
  }
  /**
  * Connects to the IRC server
  */
  IRC.prototype.connect = function()
  {
    this._tcpClient.connect(function() {
      this._tcpClient.addResponseListener(function(data) {
        this._handleServerData(data);
      }.bind(this));
			
      this._sendMessage("NICK", this.profile.nick);
      this._sendMessage("USER", [this.profile.username, "foo", "foo", this.profile.realname]);
    }.bind(this));
  }
	
  /**
  * Registers a handler for an event
  *
  * @param {String} event The event to respond to
  * @param {Function} callback The function to call when the event is fired
  */
  IRC.prototype.registerEvent = function(event, callback)
  {
    this._handlers[event] = this._handlers[event] || [];
    this._handlers[event].push(callback);
  }
	
	
  /**
  * Splits a raw server message into its component lines
  *
  * @param {String} input The message(s) from the server
  * @private
  */
  IRC.prototype._handleServerData = function(input)
  {
    var lines = input.split("\r\n");
    for(var i = 0; i < lines.length; i++)
      this._parseServerMessage(lines[i]);
  }

	
  /**
  * Parses a single line from the server according to the RFC
  *
  * @param {String} input The line from the server
  * @private
  */
  IRC.prototype._parseServerMessage = function(input)
  {
    if(input == "")
      return;
    var prefix, command, parameters;
    
    var split_input = input.split(" ");
    
    if(input[0] == ':') // messages with a prefix start with a colon
    {
      prefix = split_input.shift();
      prefix = prefix.substr(1, prefix.length); // pop off the colon
    }
    // if a param starts with a colon, it is the trailing param, and may contain spaces
    var trailing_location = -1;
    for(var i = 0; i < split_input.length; i++)
    {
      if(split_input[i][0] == ':')
      {
        trailing_location = i;
        break;
      }
    }
    if(trailing_location != -1)
    {
      split_input[trailing_location] = split_input.slice(trailing_location).join(" ");
      split_input = split_input.slice(0, trailing_location + 1);
    }
    
    command = split_input[0];
    
    parameters = split_input.slice(1);
    
    this._handleServerMessage({prefix: prefix, command: command, parameters:parameters});
  }

	
  /**
  * Responds to and handles a parsed message from the server
  *
  * @param {Object} message {prefix, command, parameters}
  * @private
  */
  IRC.prototype._handleServerMessage = function(message)
  {
    console.log(message.prefix + ": " + message.command + " " + message.parameters);
    
    if(message.command == "NOTICE")
    {
      this._fireEvent("NOTICE", message);
    }
    else if(message.command == "PING")
      this._sendMessage("PONG", []);
  }
	
  /**
  * Calls all the functions associated with the event
  *
  * @param {String} event The event being fired
  * @param {Object} data The data passed to the functions
  * @private
  */
  IRC.prototype._fireEvent = function(event, data)
  {
    if(this._handlers[event])
    {
      for(var i = 0; i < this._handlers[event].length; i++)
        this._handlers[event][i](data);
    }
  }

  /**
  * Send the given message to the server
  *
  * @param {Object} message {command, parameters}
  * @private
  */
  IRC.prototype._sendMessage = function(command, parameters)
  {
    if(!(parameters instanceof Array))
      parameters = [parameters];
    var messageString = command;
    
    for(var i = 0; i < parameters.length; i++)
    {
      messageString += " ";
      if(i == parameters.length - 1 && parameters[i].indexOf(" ") != -1)
        messageString += ":";
      messageString += parameters[i];
    }
    this._tcpClient.sendMessage(messageString);
  }





  exports.IRC = IRC;

})(window);

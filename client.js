(function() {
  "use strict";
  var client = window.client || {};
  
  client.server = null; // IP
  client.socket = null;

  client.init = function() {
    //
  }

  client.connect = function(server) {
    server = server || client.server;

    console.log("Connecting to", server);
    client.server = server;

    client.socket = new WebSocket(server);
    client.socket.binaryType = "arraybuffer";

    client.socket.onopen = client.onopen;

    client.socket.onmessage = function(msg) {
      var view = new DataView(msg.data);

      switch (view.getUint8(0)) {
        case 16:
          // do stuff
          break;
      }
    };

    client.socket.onclose = function(e) {
      console.error("WebSocket closed:", e.reason);
    };

    client.socket.error = function() {
      throw new Error("WebSocket error");
    }
  }

  window.client = client;
  $(client.init);
})();

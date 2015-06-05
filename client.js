(function() {
  "use strict";
  var client = window.client || {};
  
  client.init = function() {
    //
  }

  client.connect = function(region) {
    console.log("Connecting to", region);
    client.region = region;
  }

  window.client = client;
  $(client.init);
})();

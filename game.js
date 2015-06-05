(function() {
  "use strict";
  var game = window.game || {};
  
  game.init = function() {
    client.connect(conf.get("game.server"));
  }

  game.frame = function() {
    requestAnimationFrame(game.frame);
  }

  window.game = game;
  $(game.init);
})();

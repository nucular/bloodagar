(function() {
  "use strict";
  var lobby = window.lobby || {};

  lobby.region = null;
  lobby.server = null;

  lobby.init = function() {
    lobby.fetchRegions().done(function() {
      $("#ui").show();

      if (conf.get("game.region")) {
        lobby.setRegion(conf.get("game.region"));
        if (lobby.region.name == conf.get("game.region") && conf.get("game.server"))
          lobby.setIP(conf.get("game.server"));
      } else {
        lobby.setRegion(lobby.regions[0].name);
      }
    });

    $("#regions").on("change", function() {
      lobby.setRegion($(this).val());
    });

    $("#changeip").on("click", lobby.fetchIP);
    $("#play").on("click", lobby.play);
  }

  lobby.setRegion = function(name) {
    lobby.region = lobby.regions.filter(function(v) {
      return v.name == name;
    })[0] || lobby.regions[0];
    conf.set("game.region", lobby.region.name);

    $("#regions").val(name);
    $("#region-ip").text("Unknown");
    
    // Update the info text
    $("#region-players").text(lobby.region.numPlayers);
    $("#region-realms").text(lobby.region.numRealms);
    $("#region-servers").text(lobby.region.numServers);

    return lobby.fetchIP();
  }

  lobby.fetchRegions = function() {
    console.log("Fetching region info");
    $("#regions").children().remove();

    return $.get(conf.get("urls.lobby"))
      .retry({
        times: 10,
        timeout: 5000
      }).then(function(data) {
        data = JSON.parse(data);
        console.log("Region info", data);

        // Filter out team regions (we'll do that by checkbox later)
        // and the Unknown one
        lobby.regions = Object.keys(data.regions).filter(function(k) {
          return k.indexOf(":teams") == -1 && k != "Unknown";
        }).map(function(k) {
          data.regions[k].name = k;
          return data.regions[k];
        });

        // Add options to the select box
        $.each(lobby.regions, function(i, v) {
          $("<option></option>")
            .attr("value", v.name)
            .text(v.name)
            .appendTo("#regions");
        });

        // Update in case a region was removed
        lobby.region = (lobby.region ?
          lobby.regions.filter(function(v) {
            return v.name == lobby.region.name;
          })[0]
        : undefined) || lobby.regions[0];
        conf.set("game.region", lobby.region.name);

        // Reselect the current region
        $("#regions")
          .val(lobby.region.name)
          .attr("size", $("#regions option").length);
      });
  }

  lobby.setIP = function(ip) {
    lobby.server = ip;
    $("#region-ip").text(ip);
    conf.set("game.server", ip);

    $("#invite").attr("href", "game.html" + conf.save());
  }

  lobby.fetchIP = function() {
    console.log("Fetching server IP for region", lobby.region.name);

    $("#play").add("#changeip").attr("disabled", true);

    return $.ajax(conf.get("urls.region"), {
      dataType: "text",
      method: "POST",
      cache: false,
      crossDomain: true,
      data: lobby.region || "?"
    }).retry({
      times: 10,
      timeout: 5000
    }).then(function(data) {
      var split = data.split("\n");
      console.log("Server IP", split[0]);

      $("#play").add("#changeip").removeAttr("disabled");
      lobby.setIP(split[0]);
    });
  }

  lobby.play = function() {
    location.href = "game.html" + conf.save();
  }

  window.lobby = lobby;
  $(lobby.init);
})();

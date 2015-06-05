(function() {
  "use strict";
  var conf = window.conf || {};
  conf.deflt = {
    relay: "https://corser.herokuapp.com/",
    urls: {
      region: "http://m.agar.io/",
      lobby: "http://m.agar.io/info"
    },
    game: {
      region: ""
    }
  };

  conf.state = {};

  conf.init = function() {
    if (conf.deflt.relay) {
      for (var i in conf.deflt.urls)
        conf.deflt.urls[i] = conf.deflt.relay + conf.deflt.urls[i];
    }

    conf.state = $.extend(true, {}, conf.deflt);
    conf.load(window.location.search);
  }

  conf.set = function(path, val, obj) {
    obj = obj || conf.state;

    var rset = function(obj, path, val) {
      if (path.length == 1) {
        obj[path[0]] = val;
      } else {
        if (!obj.hasOwnProperty(path[0]))
          obj[path[0]] = {};
        rset(obj[path[0]], path.slice(1), val);
      }
    }
    rset(obj, path.split("."), val);
  }

  conf.get = function(path, obj) {
    obj = obj || conf.state;

    var rget = function(obj, path) {
      if (path.length == 1) {
        return obj[path[0]];
      } else {
        if (obj.hasOwnProperty(path[0]))
          return rget(obj[path[0]], path.slice(1));
      }
    }
    return rget(obj, path.split("."));
  }

  conf.load = function(string) {
    var search = {};
    $.each(string.substr(1).split("&"), function(i, v) {
      var s = v.split("=");
      if (!s[0])
        return;

      s[0] = decodeURIComponent(s[0]);
      s[1] = decodeURIComponent(s[1]);

      if (s[1] == "true" || s[1] == "false")
        s[1] = Boolean(s[1]);
      else if (!isNaN(Number(s[1])))
        s[1] = Number(s[1]);

      search[s[0]] = s[1];
    });

    $.each(search, conf.set);
  }

  conf.save = function() {
    var search = "?";
    var path = "";

    var rsave = function(obj, path) {
      $.each(obj, function(k, v) {
        var deflt = conf.get(path + (path == "" ? "" : ".") + k, conf.deflt);

        if (typeof v == "object") {
          rsave(v, path + (path == "" ? "" : ".") + k);
        } else if (deflt == undefined || v != deflt) {
          search +=
            (search == "?" ? "" : "&") +
            encodeURIComponent(path + (path == "" ? "" : ".") + k) +
            "=" + encodeURIComponent(v.toString());
        }
      });
    }
    rsave(conf.state, "");

    return search;
  }

  window.conf = conf;
  $(conf.init);
})();

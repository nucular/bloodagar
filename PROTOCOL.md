Let's reverse-engineer [Agar.io](http://agar.io)
================================================


Master server IP
----------------
Returns the IP of the current master server of the game.

`GET/POST http://m.agar.io/`

__Query String__
```
?
```

__Response__
```
45.79.207.55:443
```


Region listing
---------------
Returns a list of regions the player can join.

`GET http://m.agar.io/info`

__Response__
```javascript
{
    "MASTER_START": 1431545748082, // time when the master server was started
    "regions": {
        "US-Fremont": { // Region name
            "numPlayers": 6079, // Number of players
            "numRealms": 51, // Number of realms
            "numServers": 17 // Number of assigned servers
        },
        // ...
        "Unknown": {
            "numPlayers": 0,
            "numRealms": 0,
            "numServers": 0
        }
    },
    "totals": {
        "numPlayers": 37915, // Number of total connected players
        "numRealms": 352, // Number of total realms in all regions
        "numServers": 134 // Number of total servers
    }
}
```


WebSocket connection
--------------------
The binary type of the WebSocket connection should be `arraybuffer`.

### onopen
Send the following binary data using an `ArrayBuffer(5)` and a
`DataView(buffer)`:
```javascript
var buffer = new ArrayBuffer(5);
var view = new DataView(buffer);
view.setUint8(0, 254);
view.setUint32(1, 4, true); // protocol version 4?
socket.send(buffer);
```

### onmessage
The `ArrayBuffer` received in `e.data` by the `onmessage` handler starts with
an `Uint8` designating the event type. The remaining part is used as the
argument data of the event. Strings are given as a null-terminated series of
`Uint16`s on which you can use `String.fromCharCode`.  
In the following part I will describe each event type, give a hexadecimal
representation and example code snippet (where `view = new DataView(e.data)`).

__16: New object spawned?__  
[TODO]

__17: Position/camera scale updated__  
Received when the player position or camera scale updated on the server.

```
00  11  .  event type 17
01  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................  X-pos
0b  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
15  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................  Y-pos
1f  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
29  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................  scale
33  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
```
```javascript
var x = view.getFloat64(1, false);
var y = view.getFloat64(9, false);
var scale = view.getFloat64(17, false);
```

__20: Clear objects?__
[TODO]

__
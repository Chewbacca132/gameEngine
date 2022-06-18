# gameEngine
A game web-based multiplayer game engine written entirely in javascript. I used html canvas element for rendering and socket.io for networking.

To play multiplayer demo you need to have express 4.17.3+ and socket.io 4.4.1+ installed.
<br>Run `node gameEngine/demo/multiplayer/server.js {ip address}` and change {ip address} to the address the server should run on (default value is `localhost`).
Then on the same PC, or another PC on the same LAN if you set the address to the local address of the server, open a browser and enter the ip address.

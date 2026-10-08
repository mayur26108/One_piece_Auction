ONE PIECE BOUNTY AUCTION
========================
Version 1.1.0

A local multiplayer auction game inspired by One Piece. Players join a host-created room, receive a starting bounty budget, and bid on one randomly selected character at a time. The first goal is to complete a crew of 6 unique characters.

IMPORTANT
---------
This project is a fan-made game. It is not affiliated with or endorsed by Eiichiro Oda, Toei Animation, Shueisha, or any official One Piece rights holder.

FEATURES
--------
- Host creates a room for 2-8 players.
- Host chooses starting budget.
- Host chooses auction timer from 5 to 120 seconds; default is 20 seconds.
- One character is revealed at a time.
- Characters are shuffled and are not repeated in the same game.
- Players submit hidden bids to the server.
- A player cannot bid more than their remaining budget.
- Highest valid bid wins.
- Equal highest bids are randomly resolved.
- If nobody submits a positive bid, the character is assigned for free to an eligible player.
- Each player stops bidding after reaching 6 characters.
- The auction ends after exactly players x 6 character slots are filled.
- Host can RESET the current game back to the lobby without restarting Node.js.
- Any player can EXIT the current game.
- If the host exits, the room is closed for everyone.
- Rejoining a room is intentionally not treated as a permanent identity system; use a fresh lobby for a clean test.
- No character images are used.

WHAT WAS FIXED IN VERSION 1.1
------------------------------
The original testing problem was that closing/reopening the browser did not necessarily end the server-side game. The server could still be running and retain the auction state.

Version 1.1 adds:
1. EXIT GAME button.
2. HOST RESET GAME button.
3. RESET returns all players to the lobby, restores their original budget, clears their six-character collections, clears the current auction and starts a new clean character deck when the host starts again.
4. If the host exits, the room is destroyed and all connected players are returned to the home screen.
5. Finished games show a Return to Home button.

REQUIREMENTS
------------
- Windows, macOS or Linux.
- Node.js LTS installed.
- npm (included with Node.js).
- A modern browser such as Chrome, Edge, Firefox or Safari.
- Internet is NOT required for a local/LAN game after Node.js and the project files are installed.

INSTALLATION ON WINDOWS
-----------------------
1. Download and extract this project.
2. Open the extracted folder. It should contain package.json and server.js.
3. Click the Windows File Explorer address bar.
4. Type cmd and press Enter.
5. A Command Prompt opens in the correct folder.
6. Run:

   npm install

7. Then run:

   npm start

8. You should see something similar to:

   One Piece Bounty Auction running at http://localhost:3000

9. Open this in your browser:

   http://localhost:3000

DO NOT run npm install from C:\Users\YourName unless package.json is actually in that folder. The command must be run from the project folder.

STARTING A GAME
---------------
1. Open http://localhost:3000.
2. Enter the host name.
3. Choose number of players (2-8).
4. Choose starting budget, for example 50.
5. Choose timer, for example 20 seconds.
6. Click Create Lobby.
7. Give your friends the six-digit room code.
8. Friends open the same website address on their devices and enter their name plus the room code.
9. Host clicks Start Auction.

PLAYING ON THE SAME WI-FI
-------------------------
The host computer runs the server.

On the host computer:
- Run npm start.
- Find the host computer's local IPv4 address. On Windows, open Command Prompt and run:

  ipconfig

- Look for IPv4 Address, for example 192.168.1.25.

Friends on the same Wi-Fi can open:

  http://192.168.1.25:3000

Replace 192.168.1.25 with the host's actual IPv4 address.

If Windows Firewall asks whether Node.js should be allowed through the firewall, allow it on Private networks if you trust the network.

IMPORTANT: localhost means "this computer." Your friends must use the host computer's LAN IP, not localhost.

ENDING A TEST GAME
------------------
There are three ways:

A) RESET GAME — recommended for testing
- Host clicks Reset Game.
- Everyone returns to the lobby.
- Budgets are restored.
- Character lists are cleared.
- The next Start Auction creates a fresh randomized auction.

B) EXIT GAME
- Any player can click Exit Game to leave.
- If the host clicks Exit Game, the entire room is closed.

C) STOP THE SERVER
- Go to the Command Prompt running npm start.
- Press Ctrl+C.
- If Windows asks "Terminate batch job (Y/N)?", type Y and press Enter.

Start it again with:

  npm start

GITHUB: CREATE A REPOSITORY
---------------------------
You can store the project on GitHub so you have a backup and can share the source code.

1. Create or sign in to a GitHub account at:
   https://github.com/

2. Click the + button in the top-right corner and choose New repository.

3. Repository name suggestion:
   one-piece-bounty-auction

4. Add a description such as:
   Local multiplayer One Piece-inspired character auction game.

5. Choose Public if you want other people to see it, or Private if you only want your account to access it.

6. Do NOT add another README if this folder already contains README.txt. You can add one later if you rename this file to README.md.

7. Create the repository.

GITHUB: UPLOAD USING GIT COMMANDS
---------------------------------
First install Git if it is not already installed:
https://git-scm.com/downloads

Open Command Prompt in the project folder and run:

  git init
  git add .
  git commit -m "Initial release"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/one-piece-bounty-auction.git
  git push -u origin main

Replace YOUR_USERNAME with your GitHub username.

If GitHub asks you to sign in, complete the authentication shown by Git/GitHub.

GITHUB: EASIER UPLOAD WITHOUT COMMANDS
--------------------------------------
You can also upload through the GitHub website:
1. Create the repository.
2. Open the repository.
3. Click Add file -> Upload files.
4. Drag the project files/folders into the browser.
5. Commit the changes.

For a real software project, Git commands are recommended because they make future updates much easier.

UPDATING THE GITHUB VERSION LATER
----------------------------------
After changing code locally:

  git add .
  git commit -m "Describe the change"
  git push

Example:

  git add .
  git commit -m "Add auction reset controls"
  git push

DO NOT UPLOAD node_modules
--------------------------
The .gitignore file already excludes node_modules.

That is correct. Other people who clone the project run:

  npm install

and npm downloads the required packages from package.json.

RUNNING A CLONED GITHUB COPY
----------------------------
After downloading/cloning the repository:

  git clone https://github.com/YOUR_USERNAME/one-piece-bounty-auction.git
  cd one-piece-bounty-auction
  npm install
  npm start

Then open:

  http://localhost:3000

GITHUB DOES NOT AUTOMATICALLY HOST THIS NODE SERVER
---------------------------------------------------
Uploading the project to GitHub stores the source code. It does NOT by itself make the multiplayer game available at a public web address.

For friends outside your home network, you need either:
- a hosting service that supports Node.js and Socket.IO, or
- a temporary tunnel from your computer, or
- a proper VPS/cloud deployment.

For local testing and same-Wi-Fi play, GitHub is not required at all.

PROJECT STRUCTURE
-----------------
one-piece-bounty-auction/
|-- server.js                 Server, rooms and auction rules
|-- package.json              Node/npm configuration and dependencies
|-- README.txt                This guide
|-- .gitignore                Files Git should ignore
|-- data/
|   `-- characters.json       Character pool
`-- public/
    |-- index.html            Main page
    |-- styles.css             One Piece-inspired styling
    `-- app.js                 Browser game logic

AUCTION RULES IMPLEMENTED
--------------------------
Suppose there are 3 players and each starts with 50 bounty.

The game must fill:
3 players x 6 characters = 18 character slots.

Each round:
1. The server selects one unused character.
2. The character is revealed to everyone.
3. Players have the configured number of seconds to submit/change a bid.
4. The server validates every bid against the bidder's remaining budget.
5. Highest valid bid wins.
6. The winning amount is deducted from that player's budget.
7. The character is added to the winner's collection.
8. The next unused character is revealed.

If there is no valid positive bid, an eligible player receives the character for 0 bounty. This prevents the game from becoming permanently stuck when everyone is unwilling or unable to bid.

EDGE CASES HANDLED
------------------
- Too few players: host cannot start.
- Full lobby: new player is rejected.
- Game already started: new joins are rejected.
- Bid above budget: rejected.
- Negative/invalid bid: rejected.
- Player already has 6 characters: cannot bid.
- Equal highest bids: randomly resolved.
- Nobody bids: random eligible free assignment.
- Host reset: clean lobby state.
- Host exit: room closes.
- Finished auction: no additional bidding.
- Character repetition: prevented inside the same game.

CHARACTER DATABASE
------------------
The included data/characters.json is a starter character pool. You can replace it with your own larger list.

Each entry must be a JSON string inside the array, for example:

[
  "Monkey D. Luffy",
  "Roronoa Zoro",
  "Nami"
]

The pool should contain at least:
players x 6
unique names.

For example, 8 players require at least 48 unique characters.

TROUBLESHOOTING
---------------
Problem: npm says it cannot find package.json.

Cause: You ran npm install in the wrong folder.

Fix:
1. Open the extracted one-piece-bounty-auction folder.
2. Click the File Explorer address bar.
3. Type cmd and press Enter.
4. Run npm install again.

Problem: localhost:3000 does not open.

Fix:
- Make sure npm start is still running.
- Check the Command Prompt for an error.
- Make sure another program is not using port 3000.

Problem: Friends cannot connect.

Fix:
- Confirm everyone is on the same Wi-Fi/LAN.
- Use the host's IPv4 address, not localhost.
- Check Windows Firewall.
- Confirm the host server is still running.

Problem: The old auction appears again.

Fix:
- Click Reset Game as host.
- If you want to destroy the room completely, click Exit Game as host.
- If necessary, press Ctrl+C in the server terminal and run npm start again.

DEVELOPMENT NOTES
-----------------
The authoritative auction state lives on the server. Clients send bids to the server; the server validates and resolves them. This is important because a browser should not be trusted to decide the winner or deduct budgets.

The current project is designed primarily for local/LAN play and learning/testing. Before public deployment, add authentication, stronger reconnect/session handling, rate limiting, production logging, HTTPS, and persistent storage if required.

LICENSE / FAN PROJECT NOTICE
----------------------------
No official One Piece assets are bundled with this project. Character names are used for the fan-game concept. You are responsible for complying with applicable copyright, trademark and platform rules if you publish or monetize the project.

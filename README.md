# IceHacksGP Surviv.io Cheat Injector Source Code
This is the main hosting place for the source code that makes IceHacks Surviv.io Cheat Injector do stuff. Pull Requests are openly welcomed; these will be checked, compiled, and verified and may eventualy end up in the main cheat itself.

# Usage
### Folder Structure
A couple of *files* and *folders*

- Output Folder
- Source Folder
- Couple of Github stuff
- Surviv.io's App.js, if available
- Compiler
- Installer
- Package
- Package Lock
- Webpack Configuration

### File Usage
A basic run down on what the *files* do

- "app.js" is surviv.io's source code when available. This is mostly included just as reference and will need to be updated accordingly.
- "compiler.bat" is an export-like batch file, runs "*npx webpack*", and outputs a packaged and obfuscated cheat.
- "installer.bat" is a batch file that installs node.js, runs "*npm i*". Must be installed when source code is first adquired, will install in a folder in this directory. 
- "package.json" sets dependencies and info
- "package-lock.json" builds a dependency structure
- "webpack.config.json" runs obfuscation, generates a secret key, automatically sets the manifest version to X.X.X

### Folder Usage
A basic run down on what the *folders* do

Output is where the extension itself is exported to. You can use this folder as sort of a test bin of sorts. The layout of this folder should already look familiar. Its all the source code obfuscated and packed.

SRC is where the actual source code is stored in. SRC is the folder that COMPILER gets to export it to OUTPUT. Very simple.

The cheat structure itself is simple to understand if you have knowledge is JS. Even if you don't know JS, toying around with the cheat and its plugins will familiarize you with how it works. Hopefully, a full documentation is soon to come sometime in the future. This is pretty much it for a simple guide. If Viktor, who didn't know how the cheat structure worked, managed to figure it out, I'm sure you can too. Anyways, figure it out yourself. Thank you for downloading the source code, hopefully you don't skid this AND/OR make it payed, have fun, and we hope you create something better using these standard tools we left behind. We hope you continue the legacy laid out towards you, provided by HumphreyGaming and owned by IceIceBaby in collaboration with Lima, Albert, Zbot, Viktor, and SycoBak. The cheat is (mostly) yours. Have fun.

SCI today, SCI tommorow, and hopefully, SCI forever.

# Marc - i have made a quick access simplified version of this program in minify.js
## Using Node to minify and syntax check
1. Install Node.js from the internet
3. run command 'npm i'
4. run command 'npm i -g terser'
5. Run command in terminal fx example "node minifyjs.js test.js"
    - Using the program minifyjs.js to minify test.js into minified_files/test.min.js

# Martins minify programs is located in ./other_scripts, they provide a bit more security and uses more libs to syntax check

## Reqirements to those:
    1 Reccomended Acorn (pre parsing)
    2 JSHint with a .jshintrc file or Esvalidate (advanced syntax check)
    3 Terser (minifier)
    4 NodeJS
    5. sed sed for Windows 
    6. for the zx script, zx (npm install -g zx)

### If using jshint, You would likely like to add the $HOME/.jshintrc configuration file below:
{
  "curly": true,
  "undef": true,
  "unused": false,
  "browser": true,
  "eqeqeq": true,
  "immed": true,
  "latedef": true,
  "newcap": true,
  "noarg": true,
  "sub": true,
  "eqnull": true,
  "globals": {
    "googletag": true,
    "console": true,
    "googlefc": true,
    "__tcfapi": true,
    "_taboola": true,
    "opr": true
  }
}

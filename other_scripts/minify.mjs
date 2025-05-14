#!/usr/bin/env zx

//import 'zx/globals';

// Function to display error messages and exit
function exitWithError(message) {
    console.error(message);
    process.exit(1);
  }
  
  // Get the current date
  let d = new Date().toISOString().split('T')[0];
  
  // Check for arguments
  if (process.argv.length < 4) {
    exitWithError("You must enter a JavaScript file name!");
  }
  
  let infile = process.argv[3];
  
  // Check if the input file exists and is a JavaScript file
  if (!fs.existsSync(infile)) {
    exitWithError(`${infile} does not exist!`);
  }
  
  if (!infile.endsWith('.js')) {
    exitWithError(`${infile} is not a JavaScript file!`);
  }
  
  let outfile;
  if (process.argv.length < 5) {
    outfile = infile.replace(/\.js$/, '.min.js');
  } else {
    outfile = process.argv[4];
    
    if (infile === outfile) {
      exitWithError("Please don't override your source code!");
    }
    
    if (!outfile.endsWith('.min.js')) {
      exitWithError(`${outfile} for security reasons, the output extension has to be .min.js!`);
    }
  }
  
  // Create the releases directory if it doesn't exist
  if (!fs.existsSync('releases')) {
    await $`mkdir releases`;
  }
  
  let fulldir = path.resolve(infile);
  
  
  
  try {
    await $`acorn --silent --ecma2018 ${infile}`;
    console.log(`acorn succeeded`);
  } catch {
    exitWithError(`acorn failed`);
  }
  
  try {
    await $`jshint --verbose ${infile}`;
    console.log(`jshint succeeded`);
  } catch {
    exitWithError(`jshint failed`);
  }
  
  try {
    await $`terser ${infile} --compress sequences=true,conditionals=true,booleans=true --mangle --ecma 6 --output ${outfile}`;
    console.log(`minification succeeded`);
  } catch {
    exitWithError(`minification failed`);
  }
  
  await $`sed -i 's/\\* @preserve/\\*/g' ${outfile}`;
  console.log("removing @preserve keyword from multiline comments");
  
  try {
    await $`node --check ${outfile}`;
    console.log(`node check succeeded`);
    await $`cp ${infile} releases/${d}-${path.basename(infile)}`;
  } catch {
    exitWithError(`node check failed`);
  }
  
  if (fs.existsSync(outfile)) {
    console.log("========================================");
    console.log(`${outfile} successfully generated.`);
    console.log("========================================");
    console.log("Tip: in order to preserve multiline comments, add @preserve to them.");
  }
  
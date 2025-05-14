// Node pkgs
const path = require('path');
// Node can run shell commands
const { execSync } = require('child_process');

//Slice the first two words from user terminal input 
const [infile, outfileArg] = process.argv.slice(2);

if(!infile) {
  console.log('No file defined, read instructions Readme.md');
	process.exit(1);
}

// Bestem lokation og output-filnavn (standard: fil.min.js)
const outfile = path.join('minified_files', path.basename(infile).replace('.js', '.min.js'));


try {
	// Tjek først om inputfilen er gyldig JS - Erstatter esvalidate
	console.log(`🔍 Checking syntax of: ${infile}`);
	execSync(`node --check ${infile}`, { stdio: 'inherit' });

	// Minify hvis input er OK
	console.log(`🚀 Minifying ${infile}...`);
	execSync(`terser ${infile} --compress --mangle --ecma 6 --output ${outfile}`, {
		stdio: 'inherit'
	});

	// Ekstra check på output (valgfri men nice)
	execSync(`node --check ${outfile}`, { stdio: 'inherit' });

	console.log(`✅ Success! Minified and validated: ${outfile}`);
} catch (err) {
	console.error('❌ Error during minify or check');
	console.error(err.message);
	process.exit(1);
}
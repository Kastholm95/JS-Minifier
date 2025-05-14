#!/usr/bin/env bash
set -e
d=$(date +'%Y-%m-%d')
if [[ -z "$@" ]]; then
    echo >&2 "You must enter a javascript file name!"
    exit 1
elif [[ ! -f "$1" ]]; then
    echo >&2 "$1 does not exist!"
    exit 1
elif [[ $1 != *.js ]]; then
    echo >&2 "$1 is not a javasript file!"
    exit 1
fi
infile=$1
if [[ -z "$2" ]]; then
        outfile="${infile/%js/min.js}"
elif [[ "$1" == "$2" ]]; then
        echo "Please don't overrride Your source code!"
        exit 1
elif [[ $2 != *.min.js ]]; then
    echo >&2 "$2 for security reasons, the output extension has to be .min.js!"
    exit 1
else
        outfile="$2"
fi
[ ! -d "releases" ] && mkdir releases
fulldir=$(realpath "${infile}")
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
acorn --silent --ecma2018 "$infile" && echo -e "acorn ${GREEN}succeeded${NC}" || { echo -e "acorn ${RED}failed${NC}: $?"; exit 1; }
jshint --verbose "$infile" && echo -e "jshint ${GREEN}succeeded${NC}" || { echo -e "jshint ${RED}failed${NC}: $?"; exit 1; }
#esvalidate "$infile" && echo "esvalidate succeeded" || (echo "esvalidate failed" && exit 1)
terser "$infile" --compress sequences=true,conditionals=true,booleans=true --mangle --ecma 6 --output  "$outfile"  && echo -e "minification ${GREEN}succeeded${NC}" || \
{ echo -e "minification ${RED}failed${NC}"; exit 1; }
sed -i 's/\* @preserve/\*/g' $outfile && echo "removing @preserve keyword from multiline comments"
node --check "$outfile" && ( echo -e "node check ${GREEN}succeeded${NC}" && cp "$infile" "releases/$d-$infile") || { echo -e "node check ${RED}failed${NC}"; exit 1; }
if [[ -f "$outfile" ]]; then
        echo "========================================"
        echo "$outfile successfully generated."
        echo "========================================"
        echo "Tip: in order to presserve multiline comments, add @preserve to them."
fi
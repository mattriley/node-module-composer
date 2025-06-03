#!/bin/bash

function code_gen {

    local main="$PACKAGE_ROOT/main.js"
    rm "$main"

    local extensions="$PACKAGE_ROOT/extensions"
    rm -rf "$extensions"; mkdir "$extensions"

    for extension_file in "$SRC/extensions/"*; do 
        local extension_base; extension_base="$(basename "$extension_file")"
        local f="${extension_base%.*}"
        echo "require('../src/core/extensions').register('$f', require('../src/extensions/$f'));" > "$extensions/$extension_base"
        echo "require('./extensions/$f');" >> "$main"
    done;

    echo "module.exports = require('./core');" >> "$main"

}

code_gen

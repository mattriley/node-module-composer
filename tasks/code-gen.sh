#!/bin/bash

function code_gen {

    local dest="$ROOT/extensions"
    rm -rf "$dest"; mkdir "$dest"

    for extension_file in "$SRC/extensions/"*; do 
        local extension_base; extension_base="$(basename "$extension_file")"
        local extension_name="${extension_base%.*}"
        local code="require('module-composer/src/core/extensions').register('$extension_name', require('module-composer/src/extensions/$extension_name'));"
        echo "$code" > "$dest/$extension_base"
    done;

}

code_gen

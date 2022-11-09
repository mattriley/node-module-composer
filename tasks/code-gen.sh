#!/bin/bash

function code_gen {

    for extension_file in "$SRC/extensions/"*; do 

        
        local extension_base; extension_base="$(basename "$extension_file")"
        local extension_name="${extension_base%.*}"

        local code="require('module-composer/src/core/extensions').register('$extension_name', require('module-composer/src/extensions/$extension_base'));"

        echo "$code" > "$ROOT/extensions/$extension_base"

        # name="${FILE%%.*}"

        # cat file > copy_file

        # echo "$name"

    done;

}

code_gen

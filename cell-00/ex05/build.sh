#!/bin/bash
if [ $# -eq 0 ]; then
    echo "No arguments supplied."
    exit 2
fi

for arg in "$@"; do
    folder_name="ex$arg"

	mkdir "$folder_name"
done

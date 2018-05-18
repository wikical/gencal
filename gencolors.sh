#!/usr/bin/env bash

FILE="$1"
EXT=`echo "$1" | awk -F . '{print $NF}'`
BASE=`basename "$FILE" .$EXT`
shopt -s nocasematch

# https://stackoverflow.com/a/26759734
if ! [ -x "$(command -v convert)" ]; then
    echo "Error: imagemagic is not installed." >&2
    exit 1
fi
if ! [[ -f "$FILE" ]]; then
    echo "Error: $FILE does not exist." >&2
	exit 1
else
	case "$EXT" in
        jpg | gif | jpeg)
            echo Hint: non-png files are suboptimal
			echo Creating files
        ;;
        png )
            echo Good, a png file, creating files
        ;;
        svg )
            echo Good, a svg file, creating files
        ;;
        *)
            echo Must use a jpg, gif, png or svg image, last two preferred
            exit
        ;;
    esac
fi

# https://www.imagemagick.org/discourse-server/viewtopic.php?t=28963
COLORS=$(convert *.jpg +dither -colors 5 -define histogram:unique-colors=true -format "%c" histogram:info: | sort -rn)
# example output:
#       130: (199, 25, 25,255) #C71919FF srgba(199,25,25,1)
#        88: ( 72,105,153,255) #486999FF srgba(72,105,153,1)
#        70: ( 85, 35, 47, 44) #55232F2C srgba(85,35,47,0)
#        66: (111,150,196,252) #6F96C4FC srgba(111,150,196,1)
#        46: (171,173,190,248) #ABADBEF8 srgba(171,173,190,1)

echo -e "$COLORS"

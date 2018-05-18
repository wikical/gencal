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

convert "$FILE" -resize 192x192\!       android-chrome-192x192.png
convert "$FILE" -resize 512x512\!       android-chrome-512x512.png
convert "$FILE" -resize 180x180\!       apple-touch-icon.png
convert "$FILE" -resize 350x350\!       card_350x350.jpg
# https://gist.github.com/pfig/1808188#gistcomment-938494
convert "$1" -bordercolor white -border 0 \
      \( -clone 0 -resize 16x16\! \) \
      \( -clone 0 -resize 32x32\! \) \
      \( -clone 0 -resize 48x48\! \) \
      \( -clone 0 -resize 64x64\! \) \
      -delete 0 -alpha off -colors 256  favicon.ico
convert "$FILE" -resize 16x16\!         favicon-16x16.png
convert "$FILE" -resize 32x32\!         favicon-32x32.png
convert "$FILE" -resize 70x70\!         mstile-70x70.png
convert "$FILE" -resize 144x144\!       mstile-144x144.png
convert "$FILE" -resize 150x150\!       mstile-150x150.png
convert "$FILE" -resize 310x150\!       mstile-310x150.png
convert "$FILE" -resize 310x310\!       mstile-310x310.png
convert "$FILE" -resize 279x279\!       og-image.jpg
convert "$FILE" -resize 310x310\!       safari-pinned-tab.png
convert "$FILE" -resize 20x20\!         sidebar-logo.png


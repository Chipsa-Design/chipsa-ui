#!/usr/bin/env bash

# Function to display usage instructions
usage() {
    echo "Usage: $0 <video_src_path> [-o output_dir] [-f format] [-r framerate]"
    echo "  -o output_dir   Where to put processed images"
    echo "  -f format       Format of the processed images"
    echo "  -r framerate    Frames per second"
    exit 1
}

set -o errexit
set -o pipefail
set -o nounset

__pwd="$(pwd)" 
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"


if command -v tput &>/dev/null && [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
    RED=$(tput setaf 1)
    GREEN=$(tput setaf 2)
    RESET=$(tput sgr0)
else
    RED=""
    GREEN=""
    RESET=""
fi

# Check if ffmpeg exists
if ! command -v ffmpeg &> /dev/null; then
    echo "${RED}Error${RESET}: ffmpeg is not installed. Please install it to proceed." >&2
    exit 1
fi

# Check for minimum number of arguments
if [ "$#" -lt 1 ]; then
    usage
fi

VIDEO_SRC_PATH="$1"
VIDEO_SRC_DIR=$(dirname "$VIDEO_SRC_PATH")
IMG_SEQ_OUTPUT_DIR="$VIDEO_SRC_DIR/img-sequence"
IMG_SEQ_FORMAT="png"
FRAMERATE=1

shift

# printf "VIDEO_SRC_PATH, %s\n" "$VIDEO_SRC_PATH" 
# printf "Arg1, %s\n" "$arg1" 
# printf "Dir: %s\n" "$__dir" 
# printf "File: %s\n" "$__file" 
# printf "Base: %s\n" "$__base" 
# printf "PWD: %s\n" "$__pwd" 

if [ ! -f "$VIDEO_SRC_PATH" ]; then
  echo "${RED}Error${RESET}: source video does not exist." >&2
  exit 1
fi

while getopts "o:f:r:" opt; do
  case $opt in
    o)  
      IMG_SEQ_OUTPUT_DIR="$OPTARG"
      ;;
    f)
      IMG_SEQ_FORMAT="$OPTARG"
      ;;
    r)
      FRAMERATE="$OPTARG"
      ;;
    *)
      usage
      ;;
  esac
done

if [ ! -d "$IMG_SEQ_OUTPUT_DIR" ]; then
  mkdir -p "$IMG_SEQ_OUTPUT_DIR"
fi

CMD="ffmpeg"
CMD="$CMD -i "$VIDEO_SRC_PATH""
CMD="$CMD -r "$FRAMERATE""
[ "$IMG_SEQ_FORMAT" = "webp" ] && CMD="$CMD -c:v libwebp"
CMD="$CMD "$IMG_SEQ_OUTPUT_DIR/image-%03d.$IMG_SEQ_FORMAT""

$CMD

echo "${GREEN}SUCCESS${RESET}: image sequence saved to $IMG_SEQ_OUTPUT_DIR"

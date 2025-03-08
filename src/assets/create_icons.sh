#!/bin/bash

# 生成图标的基本命令，需要 ImageMagick
# 如果没有 ImageMagick，请先安装：
# macOS: brew install imagemagick
# Ubuntu/Debian: sudo apt-get install imagemagick
# Windows: 下载安装包 https://imagemagick.org/script/download.php

# 生成一个简单的夜间模式图标
generate_icon() {
  SIZE=$1
  OUTPUT="icon${SIZE}.png"
  
  # 创建一个圆形图标，半边是黑色（夜间），半边是蓝色（白天）
  convert -size ${SIZE}x${SIZE} xc:none -fill "#222222" \
    -draw "circle $((SIZE/2)),$((SIZE/2)) $((SIZE/2)),0" \
    -fill "#3F51B5" -draw "arc $((SIZE/2)),$((SIZE/2)) $((SIZE/2)),0 0,180" \
    -gravity center \
    -fill white -pointsize $((SIZE/3)) -font "Arial" -annotate +0+0 "N" \
    ${OUTPUT}
    
  echo "Generated ${OUTPUT}"
}

# 生成各种尺寸的图标
generate_icon 16
generate_icon 48
generate_icon 128

echo "All icons generated successfully!" 
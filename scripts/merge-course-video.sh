#!/usr/bin/env bash
# 路径一：把通过 /upload-course.html 上传到 /tmp/yijing_upload 的分片合并、转码，
# 输出到 public/course/videos/<course>/<lesson>.mp4，供随代码包部署（Vercel 静态 206 播放）。
#
# 用法：
#   bash scripts/merge-course-video.sh <course> <baseDir> <lessonId>
# 例：
#   bash scripts/merge-course-video.sh taiji taiji_day1_lx day1
#
# 分片目录：/tmp/yijing_upload/<course>/<baseDir>/00000 00001 ...
# 产物：public/course/videos/<course>/<lessonId>.mp4
set -euo pipefail

COURSE="${1:?需要课程标识，如 taiji}"
BASE="${2:?需要分片目录名(base)，如 taiji_day1_lx}"
LESSON="${3:?需要节次id，如 day1}"

PARTS_DIR="/tmp/yijing_upload/${COURSE}/${BASE}"
OUT_DIR="public/course/videos/${COURSE}"
RAW="/tmp/yijing_upload/_merged_${COURSE}_${LESSON}.mp4"
OUT="${OUT_DIR}/${LESSON}.mp4"

if [ ! -d "$PARTS_DIR" ]; then
  echo "错误：分片目录不存在 $PARTS_DIR" >&2
  exit 1
fi

PARTS=$(ls "$PARTS_DIR" | grep -E '^[0-9]{5}$' | sort)
if [ -z "$PARTS" ]; then
  echo "错误：目录里没有分片文件" >&2
  exit 1
fi
COUNT=$(echo "$PARTS" | wc -l)
echo "找到 $COUNT 个分片，开始合并..."

mkdir -p /tmp/yijing_upload/_merged_tmp "$OUT_DIR"
: > "$RAW"
for p in $PARTS; do
  cat "$PARTS_DIR/$p" >> "$RAW"
done
echo "合并完成：$(du -h "$RAW" | cut -f1) -> $RAW"

# 半核限流，降低打挂沙箱概率；H.264/AAC + faststart（网页渐进播放）
THREADS=$(node -e "const c=require('os').cpus().length;console.log(Math.max(1,Math.floor(c/2)))")
echo "使用 ffmpeg 线程数：$THREADS，开始转码..."
ffmpeg -y -i "$RAW" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -threads "$THREADS" \
  -movflags +faststart \
  "$OUT"

echo ""
echo "转码完成：$OUT ($(du -h "$OUT" | cut -f1))"
echo "可在课程 catalog 中登记视频地址：/course/videos/${COURSE}/${LESSON}.mp4"
echo "（合并临时文件 $RAW 保留，确认无误后可删除）"

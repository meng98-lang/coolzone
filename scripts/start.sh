#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

PORT=5000
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"


start_service() {
    cd "${COZE_WORKSPACE_PATH}"
    echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
    # 使用 Next.js 官方生产服务 next start（要求先执行过 pnpm next build 生成 .next）
    # 端口从环境变量读取，禁止硬编码
    PORT=${DEPLOY_RUN_PORT} pnpm next start -H 0.0.0.0 -p "${DEPLOY_RUN_PORT}"
}

echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
start_service

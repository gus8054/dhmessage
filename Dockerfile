# Monolith: Vite frontend + Express API. Build from repo root.

# --- Stage 1: build the SPA (Vite) ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
# npm install 대신 npm ci 사용 (의존성 충돌을 피하기 위해 legacy-peer-deps 유지)
RUN npm ci --no-audit --no-fund --legacy-peer-deps

COPY frontend/ ./

ENV VITE_API_URL=
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build

# --- Stage 2: build the API bundle ---
FROM node:22-bookworm-slim AS backend-build
# 프론트엔드와 디렉토리 구조 일관성을 위해 /app/backend 로 통일
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY backend/ ./
RUN npm run build

# --- Stage 3: runtime image ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY backend/package.json backend/package-lock.json ./
# 프로덕션 의존성만 빠르고 정확하게 설치
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Stage 2의 경로가 변경되었으므로 복사 경로도 맞춰줍니다.
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]
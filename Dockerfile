# ============================================================
# NovaKart (React) — multi-stage production build
#
#   Stage 1: node:20-alpine  → npm ci + vite build  (~300MB, discarded)
#   Stage 2: nginx:alpine    → serves dist/          (~12MB final image)
#
# Build:  docker build -t novakart-react .
# Run:    docker run -p 3000:80 novakart-react
# ============================================================

# ---------- Stage 1: build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy manifests first so the npm ci layer is cached
# and only re-runs when dependencies change
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Now copy source and build
COPY index.html vite.config.js ./
COPY src/ ./src/
RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine

LABEL maintainer="Abhishek Khadekar" \
      app="novakart-react" \
      description="Production-grade e-commerce demo — React + Vite SPA on nginx"

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/novakart.conf

# Only the built assets make it into the final image
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

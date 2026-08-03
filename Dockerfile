FROM node:20-bookworm-slim AS dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && mkdir -p /out && \
		if [ -d dist/astro-track-frontend/browser ]; then \
			cp -R dist/astro-track-frontend/browser/. /out/; \
		else \
			cp -R dist/astro-track-frontend/. /out/; \
		fi

FROM nginx:1.27-alpine AS production

COPY docker/nginx.conf /docker-config/default.conf.template
COPY docker/frontend-entrypoint.sh /docker-entrypoint.d/99-runtime-config.sh
COPY --from=build /out/ /usr/share/nginx/html/

RUN sed -i 's/\r$//' /docker-entrypoint.d/99-runtime-config.sh \
	&& tr -d '\r' < /docker-entrypoint.d/99-runtime-config.sh > /tmp/99-runtime-config.sh \
	&& mv /tmp/99-runtime-config.sh /docker-entrypoint.d/99-runtime-config.sh \
	&& chmod +x /docker-entrypoint.d/99-runtime-config.sh

EXPOSE 80

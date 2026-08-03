#!/bin/sh
set -eu

runtime_config_file=/usr/share/nginx/html/assets/runtime-config.js
runtime_api_url=${ASTRO_TRACK_PUBLIC_API_URL:-/api}
backend_origin=${ASTRO_TRACK_BACKEND_ORIGIN:-http://backend:5000}
escaped_runtime_api_url=$(printf '%s' "$runtime_api_url" | sed 's/[\\&/]/\\&/g')
escaped_backend_origin=$(printf '%s' "$backend_origin" | sed 's/[\\&/]/\\&/g')

cat > "$runtime_config_file" <<EOF
window.__ASTRO_TRACK_RUNTIME_CONFIG__ = {
  apiUrl: "$escaped_runtime_api_url",
};
EOF

sed "s#__ASTRO_TRACK_BACKEND_ORIGIN__#${escaped_backend_origin}#g" /docker-config/default.conf.template > /etc/nginx/conf.d/default.conf
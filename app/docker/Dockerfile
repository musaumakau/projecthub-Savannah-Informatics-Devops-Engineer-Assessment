FROM nginx:alpine

# Copy frontend files
COPY public/index.html /usr/share/nginx/html/index.html
COPY src/ /usr/share/nginx/html/src/

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
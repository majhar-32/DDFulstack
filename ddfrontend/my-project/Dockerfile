# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
#Dependencies install
COPY package.json .
COPY package-lock.json .
RUN npm install
#Build process
COPY . .
RUN npm run build

# Stage 2: Serve the application with a lightweight Nginx web server
FROM nginx:alpine
# Default Nginx config সরিয়ে কাস্টম config ব্যবহার করা হচ্ছে
RUN rm /etc/nginx/conf.d/default.conf
# SPA রাউটিংয়ের জন্য কাস্টম nginx.conf কপি করা
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Build স্টেজ থেকে তৈরি হওয়া স্ট্যাটিক ফাইল কপি করা
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
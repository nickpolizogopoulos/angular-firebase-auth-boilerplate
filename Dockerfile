FROM node:22.14.0-alpine3.21

# Create non-root user.
RUN addgroup app && adduser -S -G app app

# Set the working directory.
WORKDIR /app

# Copy files needed for dependencies.
COPY package*.json .

# Install dependencies.
RUN npm install

# Copy all the application files.
COPY . .

# Fix permissions for all app files.
RUN chown -R app:app /app

# Set non-root user.
USER app

# Run dev server as app user.
EXPOSE 4200

# Start the Application - Exec form.
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

# To run: docker run -p 4200:4200 angular-firebase-auth-boilerplate
# Use Python 3.9 image
FROM python:3.9

# Set the working directory for the application
WORKDIR /e4a

# Copy the requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the Python application files
COPY translator.py .

# Install Node.js and dependencies
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy the Node.js application files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY public ./public
COPY config ./config
COPY utils ./utils
COPY helpers ./helpers
COPY middlewares ./middlewares
COPY models ./models
COPY services ./services
COPY controllers ./controllers
COPY routes ./routes
# Copy the Node.js server file
COPY index.js .

# Expose the necessary ports
EXPOSE 5000 8080

# Start both Flask and Node.js servers
CMD ["sh", "-c", "python translator.py & node index.js"]

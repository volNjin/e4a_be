# Use a Python base image
FROM python:3.9

# Set the working directory
WORKDIR /e4a

# Copy Python dependencies and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the Python application
COPY translator.py .

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy Node.js dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy Node.js server file
COPY index.js .

# Expose necessary ports
EXPOSE 5000 8080

# Start both Flask and Node.js servers
CMD ["sh", "-c", "python translator.py & node index.js"]

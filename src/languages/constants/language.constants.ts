export const SUPPORTED_LANGUAGES = {
  NODE: {
    name: 'Node.js',
    versions: ['16', '18', '20'],
    template: `FROM node:{{version}}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]`,
  },
  PYTHON: {
    name: 'Python',
    versions: ['3.8', '3.9', '3.10'],
    template: `FROM python:{{version}}
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]`,
  },
  JAVA: {
    name: 'Java',
    versions: ['11', '17'],
    template: `FROM openjdk:{{version}}
WORKDIR /app
COPY . .
RUN javac Main.java
CMD ["java", "Main"]`,
  },
  GO: {
    name: 'Go',
    versions: ['1.18', '1.19', '1.20'],
    template: `FROM golang:{{version}}
WORKDIR /app
COPY . .
RUN go build -o main .
CMD ["./main"]`,
  },
  PHP: {
    name: 'PHP',
    versions: ['8.0', '8.1', '8.2'],
    template: `FROM php:{{version}}-apache
WORKDIR /var/www/html
COPY . .
RUN docker-php-ext-install mysqli pdo pdo_mysql
CMD ["apache2-foreground"]`,
  },
  RUBY: {
    name: 'Ruby',
    versions: ['3.0', '3.1', '3.2'],
    template: `FROM ruby:{{version}}
WORKDIR /app
COPY Gemfile* ./
RUN bundle install
COPY . .
CMD ["rails", "server", "-b", "0.0.0.0"]`,
  },
  RUST: {
    name: 'Rust',
    versions: ['1.60', '1.65', '1.70'],
    template: `FROM rust:{{version}}
WORKDIR /app
COPY . .
RUN cargo build --release
CMD ["./target/release/your_binary"]`,
  },
  // Add more languages as needed
};

export const FRAMEWORK_CONFIGS = {
  LARAVEL: {
    name: 'Laravel',
    language: 'PHP',
    requirements: ['composer.json'],
    buildCommand: 'composer install --optimize-autoloader --no-dev',
    startCommand: 'php artisan serve --host=0.0.0.0',
  },
  SPRING_BOOT: {
    name: 'Spring Boot',
    language: 'Java',
    requirements: ['pom.xml'],
    buildCommand: 'mvn clean package',
    startCommand: 'java -jar target/*.jar',
  },
  DJANGO: {
    name: 'Django',
    language: 'Python',
    requirements: ['requirements.txt', 'manage.py'],
    buildCommand: 'pip install -r requirements.txt',
    startCommand: 'python manage.py runserver 0.0.0.0:8000',
  },
  EXPRESS: {
    name: 'Express',
    language: 'Node.js',
    requirements: ['package.json'],
    buildCommand: 'npm install',
    startCommand: 'node app.js',
  },
  RAILS: {
    name: 'Ruby on Rails',
    language: 'Ruby',
    requirements: ['Gemfile'],
    buildCommand: 'bundle install',
    startCommand: 'rails server -b 0.0.0.0',
  },
  // Add more frameworks as needed
};
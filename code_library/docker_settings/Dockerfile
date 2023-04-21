# Usar imagen base de PHP con Apache
FROM php:8.0-apache

# Instalar las extensiones necesarias de PHP y las herramientas para compilar
RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    mariadb-client \
    && docker-php-ext-install zip pdo_mysql

# Habilitar el módulo de reescritura de Apache para soportar .htaccess
RUN a2enmod rewrite

# Copiar la configuración de virtual host personalizada
COPY ./docker-config/apache/vhost.conf /etc/apache2/sites-available/000-default.conf

# Cambiar el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos de la aplicación PHP
COPY ./src /var/www/html

# Dar permisos de escritura al directorio de public
RUN chown -R www-data:www-data /var/www/html/public

# Exponer el puerto 80 para el servidor web
EXPOSE 80

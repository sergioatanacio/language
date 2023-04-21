# b_list_item
Comandos a ejecutar:

docker-compose up -d
docker exec -it name_or_id_container bash

Dentro del contenedor de mysql:
    mysql -u my_user -p
        my_password

mysql -u nombre_de_usuario -p
CREATE DATABASE nombre_de_la_base_de_datos;
mysql -u nombre_de_usuario -p nombre_de_la_base_de_datos < /ruta/del/archivo.sql
docker stop $(docker ps -aq)

El objetivo es crear un sistema de tareas. Donde se designe la tarea y ver el estado en que se está haciendo. Si se está resolviendo o no.


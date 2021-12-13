### Instalación del servidor de la base de datos

En esta sección se explican los pasos para instalar la base de datos. Se inicia con la instalación del servidor y luego se expone cómo integrar los datos.

El servidor utilizado es MariaDB en un host archlinux.

    $ pacman -S mariadb mariadb-clients
    $ mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
    
Como resultado, se desplagarán este mensaje:

    Installing MariaDB/MySQL system tables in '/var/lib/mysql' ...
    OK

    To start mysqld at boot time you have to copy
    support-files/mysql.server to the right place for your system


    Two all-privilege accounts were created.
    One is root@localhost, it has no password, but you need to
    be system 'root' user to connect. Use, for example, sudo mysql
    The second is mysql@localhost, it has no password either, but
    you need to be the system 'mysql' user to connect.
    After connecting you can set the password, if you would need to be
    able to connect as any of these users with a password and without sudo

    See the MariaDB Knowledgebase at https://mariadb.com/kb or the
    MySQL manual for more instructions.

    You can start the MariaDB daemon with:
    cd '/usr' ; /usr/bin/mysqld_safe --datadir='/var/lib/mysql'

    You can test the MariaDB daemon with mysql-test-run.pl
    cd '/usr/mysql-test' ; perl mysql-test-run.pl

    Please report any problems at https://mariadb.org/jira

    The latest information about MariaDB is available at https://mariadb.org/.
    You can find additional information about the MySQL part at:
    https://dev.mysql.com
    Consider joining MariaDB's strong and vibrant community:
    https://mariadb.org/get-involved/

A continuación habilite e inicie el servicio mariadb:

    $ systemctl enable mariadb
    $ systemctl start mariadb

Luego, entre en el cliente mysql, para configurar el servicio:

    $ mysql -u root
    
Dentro del cliente mysql, crea el usuario para administrar la base de datos. Escajo un password apropiado:

    > USE mysql;
    > CREATE USER 'dbadmin'@'localhost' IDENTIFIED BY 'PASSWORD';
    > GRANT ALL PRIVILEGES ON mydb.* TO 'dbadmin'@'localhost';
    > FLUSH PRIVILEGES;
    > quit;
    
### Construición de la base de datos

Para la construcción inicial de la base de datos, ubicase en el siguiente directorio (asumiendo que ya está ubicado en el directorio de la aplicación CEMIF):

    $ cd data/batch1
    
Y luego ejecute el siguiente comando:

    $ make
    
La construcción de la base dará inicio, corriendo en forma automática los scripts correspondientes. Este proceso puede demorar varias horas.

## Requerimientos

Python:

- pandas

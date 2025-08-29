Documentación de la Aplicación: To-Do List con Pomodoro
📌 1. Descripción General de la Aplicación

La aplicación es un sistema de gestión de tareas (To-Do List) junto con la funcionalidad Pomodoro para mejorar la productividad.

Objetivo de la Aplicación:

To-Do List: Permite agregar, editar, eliminar y marcar tareas como completadas. Ideal para organizar pendientes diarios.

Pomodoro: Implementa la técnica Pomodoro para dividir el tiempo de trabajo en intervalos (normalmente 25 minutos de trabajo y 5 minutos de descanso). Esto mejora la concentración y optimiza el uso del tiempo.

Tecnologías Utilizadas:

Backend: Flask (Python 3.x)

Frontend: HTML, CSS y JavaScript

Despliegue: AWS EC2 (Ubuntu 22.04 LTS)

Proxy Reverso: Nginx (para exponer la aplicación Flask)

La aplicación está desplegada en AWS EC2, en una instancia gratuita (Free Tier), y es accesible públicamente desde el navegador.

URL de la Aplicación:

La aplicación está disponible en la siguiente URL:

http://3.16.108.173/

⚙️ 2. Tecnologías Utilizadas

La aplicación fue construida utilizando las siguientes tecnologías:

AWS EC2: Instancia Ubuntu Server 22.04 LTS.

Flask: Framework de Python para crear aplicaciones web.

HTML/CSS/JavaScript: Para la interfaz de usuario.

Nginx: Utilizado como proxy reverso para exponer Flask al público.

EC2 Instance Connect: Para la conexión remota con la instancia EC2.

📋 3. Requisitos Previos

Para replicar este despliegue, necesitarás tener lo siguiente:

Cuenta en AWS Free Tier: Necesaria para crear instancias EC2 en el plan gratuito.

Instancia EC2 Ubuntu Server 22.04 LTS: Se utiliza para alojar la aplicación.

Grupos de Seguridad en AWS: Los puertos deben estar configurados correctamente para el acceso.

Puertos a Abrir en Security Groups:

22: Para acceso SSH a la instancia (EC2 Instance Connect).

80: Para acceso HTTP público a la aplicación mediante Nginx.

5000: Puerto interno para Flask (si se ejecuta directamente sin Nginx).

5. Paso a Paso del Despliegue
5.1 Crear Instancia EC2

Ingresar a AWS Console y seleccionar EC2.

Clic en Launch Instance para crear una nueva instancia.

Configuración recomendada:

AMI: Ubuntu Server 22.04 LTS (Free Tier).

Tipo de Instancia: t3.micro (también en Free Tier).

Almacenamiento: 8 GB (por defecto, puedes ajustar si lo deseas).

Security Group: Configura los puertos a abrir: 22, 80, y 5000.

Haz clic en Launch para crear la instancia.

5.2 Conexión con EC2 Instance Connect

Selecciona la instancia recién creada en la consola de AWS EC2.

Clic en el botón Connect.

Selecciona la opción EC2 Instance Connect para abrir una terminal directamente desde el navegador.

5.3 Instalar Dependencias en la Instancia

Para que la aplicación funcione correctamente, debes instalar varias dependencias en la instancia EC2. A continuación, se detallan los pasos para instalar las dependencias necesarias:
```
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Python y pip
sudo apt install python3 python3-pip -y

# Instalar Flask
pip3 install flask

# Instalar Nginx
sudo apt install nginx -y
```
5.4 Clonar el Repositorio con la Aplicación
git clone https://github.com/<usuario>/mi-proyecto-aws.git
cd mi-proyecto-aws/src

5.5 Configuración de Flask

Asegúrate de que tu app.py tenga lo siguiente en la parte final:

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    Ejecutar la aplicación:

python3 app.py


Verificar que funciona abriendo en navegador:

http://<IP_PÚBLICA>:5000

5.6 Configuración de Nginx como Proxy Reverso

Editar la configuración de Nginx:

sudo nano /etc/nginx/sites-available/default


Reemplazar el bloque location / { ... } por:

location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}


Probar y reiniciar Nginx:

sudo nginx -t
sudo systemctl restart nginx


Ahora la aplicación Flask estará disponible en:

http://<IP_PÚBLICA>

📷 6. Capturas de Pantalla
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)

🐞 7. Problemas Encontrados y Soluciones
⚠️ Problema: Página de Nginx en lugar de mi aplicación Flask

Cuando abría http://3.16.108.173/, aparecía la página por defecto de Nginx en vez de mi aplicación Flask.

Causa: Nginx estaba sirviendo su propia página inicial en /var/www/html/index.nginx-debian.html.

✅ Solución:

Configuré Nginx como proxy reverso para redirigir al puerto 5000 donde corre Flask.

Reinicié Nginx y la aplicación Flask se mostró correctamente.

8. Consejos 

Usar host="0.0.0.0" en Flask para exponer la aplicación.

Siempre probar los puertos en Security Groups antes de depurar errores.

Nginx facilita exponer la aplicación en el puerto 80, en lugar de usar directamente el 5000.

Documentar errores encontrados para futuras implementaciones.

👨‍🏫 9. Reflexión y Aprendizajes

Aprendí a desplegar una aplicación Flask en AWS EC2 usando EC2 Instance Connect.

Comprendí cómo funciona Nginx como proxy reverso.

Verifiqué la importancia de abrir correctamente los puertos de Security Group.

Este proceso me ayudó a mejorar mis habilidades en despliegue en la nube.
                                                            

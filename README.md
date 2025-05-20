# PsicopeApp

Aplicación para gestionar sesiones de psicopedagogía con pacientes, familias y escuelas. Informe de importes por sesión, por día, diferencias por Medios de Pago,
generación de facturas de AFIP, recordatorios, informes..

## Pasos para ejecutar la aplicación en desarrollo

### 1. Crear un archivo .env que contenta la siguiente información en el directorio root del proyecto
* **DB_HOST**=host
* **DB_USER**=userdb
* **DB_PASS**=passdb
* **DB_NAME**=nombredb
* **DB_DIALECT**=mysql

### 2. Instalar dependencias

Dentro del directorio del proyecto, ejecutar por consola el comando **npm install**

### 3. Crear la BD

Dentro del directorio del proyecto, ejecutar por consola el comando **npm run createDB** (el script se encuentra definido en package.json)

## 4. Ejecutar las migraciones

Dentro del directorio del proyecto, ejecutar por consola el comando **npm run migrate** (el script se encuentra definido en package.json)
Verificar que las migraciones se hayan impactado correctamente en la BD

## 5. Correr la aplicación
Dentro del directorio del proyecto, ejecutar por consola el comando **npm run start**. El mismos buscará el archivo main.js e iniciará la aplicación

## 6. Debuggear TEST
Primero, setear los breakpoints.
Ir a **Run and Debug (Ctrl+Shift+D)**, seleccionar **Debug Jest Test** y darle a play. La aplicación correrá los test y se frenará en los breakpoints configurados.

## 6. Debugear Aplicación
Primero, setear los breakpoints.
Asegurarse de tener **Debug Main Process** seleccionado en **Run and Debug**, luego ir al Menú **Run->Start Debugging**. La aplicación se iniciará y frenará en los breakpoints configurados.

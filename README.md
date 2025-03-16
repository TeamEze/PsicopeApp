# PsicopeApp 

Aplicación para gestionar sesiones de psicopedagogía

# Arquitectura de la aplicación

/src
├── renderer/               # Interfaz de Usuario (React)
│   ├── App.js              # Componente principal
│   └── viewmodels/
│       └── UserViewModel.js
├── models/                 # Modelos (ORM y Validaciones)
│   └── User.js
├── database/               # Configuración de la base de datos
│   ├── index.js
│   └── UserRepository.js
├── services/               # Lógica de negocio
│   └── UserService.js
├── main.js                 # Proceso Principal Electron
└── preload.js              # Comunicación Segura (IPC)

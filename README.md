🚗 Sistema de Administración de Tags de Telepeaje (SADT)

Sistema web full-stack diseñado para la gestión, control y validación de tags vehiculares (padrón de placas), optimizado con una arquitectura serverless en la nube de AWS.

🛠️ Tecnologías Utilizadas

Frontend

Angular 18: Framework SPA moderno basado en componentes standalone.

Tailwind CSS: Diseño de interfaces responsivas y modernas.

AWS S3: Alojamiento estático para distribución global de alta disponibilidad.

Backend & Base de Datos

ASP.NET Core (.NET 10): Web API RESTful de alto rendimiento.

AWS Lambda: Ejecución de código serverless mediante Lambda Function URLs.

Amazon DynamoDB: Base de datos NoSQL para almacenamiento estructurado de usuarios y tags.

JWT (JSON Web Tokens): Mecanismo de autenticación y autorización segura.

📂 Estructura del Proyecto

├── src/                      # Código fuente de Angular 18 (Frontend)
│   ├── app/                  # Componentes, servicios, modelos y guardias
│   └── environments/         # Configuración de entornos (excluido en .gitignore)
├── TagAPI/                   # API REST en .NET 10 (Backend)
│   ├── Controllers/          # Endpoints de Autenticación y Tags
│   ├── Repositories/         # Capa de acceso a datos (AWS SDK para DynamoDB)
│   └── Services/             # Lógica de negocio y generación de JWT
├── .gitignore                # Archivos y carpetas excluidos de Git
└── README.md                 # Documentación oficial del sistema


⚙️ Configuración y Ejecución Local

1. Clonar el repositorio

git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio


2. Configurar y arrancar el Backend (.NET)

Navega a la carpeta de la API:

TagAPI


Restaura paquetes y ejecuta el servidor de desarrollo:

dotnet restore
dotnet run


La API escuchará por defecto en http://localhost:5045.

3. Configurar y arrancar el Frontend (Angular)

Crea tu archivo de entorno local src/environments/environment.ts basado en el template:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5045/api'
};


Instala dependencias y corre el servidor local:

npm install
ng serve


La aplicación web estará disponible en http://localhost:4200.

☁️ Guía de Despliegue en Producción (AWS)

1. Backend en AWS Lambda

Generar el paquete de despliegue:

dotnet lambda package -c Release -f net10.0 -o bin/net10.0/api-telepeaje.zip


Subir a AWS: Sube el archivo .zip generado a tu función de AWS Lambda desde la consola.

Variables de Entorno obligatorias en Lambda:
Configura las siguientes llaves en la sección Configuration > Environment variables (nota el uso de doble guion bajo para la jerarquía de .NET):

Jwt__Key = TuClaveSecreta

Jwt__Issuer = AppTelepeaje

Jwt__Audience = UsuariosAngular

Permisos de IAM: Asegúrate de asociar una política con permisos de acceso a DynamoDB (ej. AmazonDynamoDBFullAccess) al rol de ejecución de tu Lambda.

CORS: Habilita el CORS en la configuración de la Function URL de tu Lambda permitiendo los orígenes de tu S3 y las cabeceras content-type y authorization.

2. Frontend en AWS S3

Actualizar entorno de producción (src/environments/environment.prod.ts):

export const environment = {
  production: true,
  apiUrl: 'https://TU-LAMBDA-URL.lambda-url.us-east-2.on.aws/api'
};


Compilar el proyecto:

ng build --configuration production


Subir al Bucket S3: Sube todo el contenido de la carpeta resultante dist/tu-proyecto/browser directamente a la raíz de tu bucket en Amazon S3.

Habilitar Static Website Hosting: Configura el bucket para alojamiento estático asignando index.html tanto al documento de índice como al documento de error (Error document), asegurando el funcionamiento correcto de las rutas de Angular SPA.

🔒 Seguridad y Control de Versiones

Los archivos de entorno (environment.ts, environment.prod.ts) están excluidos del repositorio mediante el archivo .gitignore para proteger las credenciales y URLs de producción.
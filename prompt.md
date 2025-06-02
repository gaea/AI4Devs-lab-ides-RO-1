# Prompt para Crear un Sistema de Seguimiento de Candidatos (ATS)

## Descripción del Proyecto

Desarrollar un Sistema de Seguimiento de Candidatos (ATS - Applicant Tracking System) moderno y eficiente utilizando una arquitectura de microservicios con las siguientes tecnologías:

- Backend: Node.js con Express y Prisma ORM
- Frontend: React con TypeScript
- Base de datos: PostgreSQL
- Testing: Jest para ambos frontend y backend
- Gestión de dependencias: npm/yarn
- Control de versiones: Git

## Estructura del Proyecto

### Arquitectura General

```
project-root/
├── backend/         # Servicio API REST
├── frontend/        # Aplicación web React
└── docker-compose.yml  # Configuración de servicios
```

### Backend (Clean Architecture)

```
backend/
├── src/
│   ├── application/      # Casos de uso
│   ├── domain/          # Entidades y reglas de negocio
│   ├── infrastructure/  # Implementaciones técnicas
│   ├── interfaces/      # Controladores y DTOs
│   └── shared/          # Utilidades compartidas
├── prisma/              # Esquemas y migraciones
└── uploads/            # Almacenamiento de archivos
```

### Frontend (React con TypeScript)

```
frontend/
├── public/
└── src/
    ├── components/    # Componentes React
    ├── services/      # Servicios API
    ├── hooks/         # Custom hooks
    └── types/         # Definiciones TypeScript
```

## Especificaciones Técnicas

### 1. Backend

#### 1.1 Modelos de Datos (Prisma Schema)

```prisma
model Candidate {
  id             Int      @id @default(autoincrement())
  firstName      String   @db.VarChar(100)
  lastName       String   @db.VarChar(100)
  email         String   @unique
  phone         String?
  address       String?
  education     String?  @db.Text
  workExperience String? @db.Text
  cvUrl         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### 1.2 Características Backend

- Arquitectura limpia (Clean Architecture)
- Validación de datos con clases de dominio
- Manejo de errores centralizado
- Carga y almacenamiento de archivos (CV)
- Tests unitarios y de integración
- Documentación API con Swagger/OpenAPI

### 2. Frontend

#### 2.1 Componentes Principales

1. Dashboard del Reclutador
2. Formulario de Añadir Candidato
3. Lista de Candidatos
4. Componentes de Layout

#### 2.2 Características Frontend

- Diseño responsive
- Validación de formularios
- Carga de archivos
- Manejo de estados y errores
- Accesibilidad (WCAG 2.1)
- Tests de componentes

## Historia de Usuario Principal

### Añadir Candidato al Sistema

**Como** reclutador,  
**Quiero** poder añadir nuevos candidatos al sistema ATS de manera sencilla y eficiente,  
**Para** gestionar sus datos y procesos de selección de forma centralizada y organizada.

#### Criterios de Aceptación

1. **Acceso a la Funcionalidad**
   - Botón/enlace visible en el dashboard principal
   - Acceso rápido y directo

2. **Formulario de Registro**
   - Campos:
     - Nombre
     - Apellido
     - Correo electrónico
     - Teléfono
     - Dirección
     - Educación
     - Experiencia laboral
     - CV (archivo)

3. **Validación de Datos**
   - Campos obligatorios
   - Formato de email válido
   - No espacios en blanco

4. **Carga de Documentos**
   - Soporte para PDF/DOCX
   - Validación de tipo y tamaño

5. **Confirmación y Errores**
   - Mensajes claros de éxito/error
   - Manejo de excepciones

## Instrucciones de Implementación

### 1. Configuración Inicial

```bash
# Crear estructura del proyecto
mkdir ats-project && cd ats-project
npm init -y

# Inicializar backend
mkdir backend
cd backend
npm init -y
npm install express prisma @prisma/client typescript ts-node @types/node @types/express

# Inicializar frontend
npx create-react-app frontend --template typescript
```

### 2. Configuración de Base de Datos

```bash
# En el directorio backend
npx prisma init
# Configurar DATABASE_URL en .env
npx prisma migrate dev --name init
```

### 3. Desarrollo Backend

1. Implementar entidades de dominio
2. Crear casos de uso
3. Implementar repositorios
4. Configurar rutas y controladores
5. Añadir middleware para archivos

### 4. Desarrollo Frontend

1. Crear componentes base
2. Implementar formularios
3. Añadir validaciones
4. Integrar con API
5. Aplicar estilos y responsividad

## Mejores Prácticas

1. **Arquitectura**
   - Separación clara de responsabilidades
   - Inyección de dependencias
   - Principios SOLID

2. **Código**
   - TypeScript strict mode
   - ESLint + Prettier
   - Convenciones de nombrado consistentes

3. **Testing**
   - Tests unitarios
   - Tests de integración
   - Cobertura > 80%

4. **Seguridad**
   - Validación de inputs
   - Sanitización de datos
   - Manejo seguro de archivos

## Entregables Esperados

1. Código fuente completo en GitHub
2. Documentación API
3. README con instrucciones
4. Tests automatizados
5. Scripts de despliegue


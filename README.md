# Usuarios

## Usuario de administrador

En pocketbase el usuario administrador es:

```text
Usuario: fmpp3@alu.ua.es
Contraseña: pocketbase
```

Así mismo, para acceder al administrador de la aplicación, se usaría el mismo usuario.

## Usuario de la aplicación

Si se quiere acceder con usuario ya creado:

```text
Usuario: elena@alu.ua.es
Contraseña: 12345678
```

# Requisitos adicionales

## Gestión de Comentarios (CRUD)
Este documento describe el funcionamiento de las operaciones CRUD (Crear, Leer, Actualizar y Borrar) para el sistema de comentarios de la aplicación.

### 1. Creación (Create)
La creación de comentarios se realiza directamente en la página de Detalle de Receta (RecipeDetailPage.vue).

Requisito: El usuario debe estar autenticado.

Funcionamiento: El usuario selecciona una puntuación (estrellas) y escribe su opinión. Al pulsar "Enviar", se utiliza el servicio crearComentario para registrar en la base de datos el texto, la valoración, el ID del usuario y el ID de la receta asociada.

### 2. Lectura (Read)
Existen tres niveles de lectura de comentarios en la aplicación:

Pública (Receta): Cualquier usuario puede leer los comentarios asociados a una receta específica en su página de detalles.

Privada (Usuario): En la sección Mis Comentarios (/comments), accesible desde el perfil, el usuario puede ver el historial de todas las críticas que ha realizado.

Administrativa (Admin): En la página de Gestión de Comentarios (/listcomments), el administrador puede visualizar la totalidad de los comentarios de la plataforma, incluyendo el autor, la receta, la fecha y la valoración.

### 3. Actualización (Update / Editar)

Lógica: Se ha decidido que el administrador no debe modificar las palabras de los usuarios para preservar la integridad de las opiniones.

Dónde editar: Un usuario solo puede editar sus propios comentarios desde su sección personal de Mis Comentarios dentro de su perfil. Allí se permite modificar tanto el texto como la puntuación original.

### 4. Borrado (Delete)
El sistema permite la eliminación de registros en dos ámbitos:

[Auto-gestión:](http://localhost:8100/home) El usuario puede borrar sus comentarios desde su perfil si desea eliminar su opinión de una receta.

Moderación: El administrador tiene la facultad de eliminar cualquier comentario desde la página de gestión administrativa (/listcomments) en caso de contenido inapropiado o spam.

**Resumen Técnico**

Servicio: src/services/comentariosService.ts maneja las llamadas a la API de PocketBase.

Estado: Pinia (src/stores/main.ts) gestiona el estado global de los comentarios del usuario y del administrador para asegurar una interfaz reactiva.

Interfaz: Se utiliza alertController de Ionic para confirmar eliminaciones de forma segura.

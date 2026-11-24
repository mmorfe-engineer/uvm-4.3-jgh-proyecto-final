# DIAGRAMA DE ESTRUCTURA DE LA BASE DE DATOS NOSQL (MONGODB)

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Motor:** MongoDB con modelado Mongoose ODM  

---

## 1. DIAGRAMA ENTIDAD-RELACIÓN / DOCUMENTAL (MERMAID)

```mermaid
erDiagram
    USER ||--o{ SURVEY : "crea (admin)"
    USER ||--o{ RESPONSE : "responde (participante)"
    SURVEY ||--o{ RESPONSE : "recibe"
    CONTACT_SUBMISSION }|..|| USER : "puede referenciar"

    USER {
        ObjectId _id PK
        string name "Requerido, trim"
        string email UK "Requerido, lowercase, único"
        string passwordHash "Bcrypt salt 10, no expuesto en JSON"
        string role "Enum: admin | participant"
        date createdAt "Timestamp"
        date updatedAt "Timestamp"
    }

    SURVEY {
        ObjectId _id PK
        string title "Requerido, trim"
        string description "Descripción de objetivos formativos"
        string topic "Área temática (p. ej. Bioética, Salud, Valores)"
        string status "Enum: draft | published | closed"
        array questions "Lista embebida de preguntas"
        ObjectId createdBy FK "Ref -> User"
        date publishedAt "Fecha de publicación"
        date createdAt "Timestamp"
        date updatedAt "Timestamp"
    }

    RESPONSE {
        ObjectId _id PK
        ObjectId surveyId FK "Ref -> Survey, requerido"
        ObjectId participantId FK "Ref -> User, requerido"
        array answers "Lista embebida: { questionId, value }"
        date submittedAt "Timestamp único por (surveyId, participantId)"
    }

    CONTACT_SUBMISSION {
        ObjectId _id PK
        string name "Requerido, texto"
        string email "Requerido, email validado"
        string phone "Requerido, teléfono"
        date proposedDate "Requerido, fecha propuesta"
        number estimatedParticipants "Requerido, número entero > 0"
        string requestType "Requerido, radio: institucional|comunitaria|academica"
        string message "Requerido, textarea"
        object attachmentMetadata "Opcional: { originalName, filename, mimeType, sizeBytes, storagePath }"
        date createdAt "Timestamp"
    }
```

---

## 2. ÍNDICES Y RESTRICCIONES DE INTEGRIDAD
1. **Colección `users`:**
   - Índice único: `{ email: 1 }` (garantiza que no existan cuentas duplicadas).
2. **Colección `surveys`:**
   - Índice compuesto: `{ status: 1, createdAt: -1 }` (optimiza la consulta pública de encuestas publicadas).
   - Índice de búsqueda de texto: `{ title: "text", topic: "text", description: "text" }`.
3. **Colección `responses` (Módulo reservado):**
   - Índice compuesto único: `{ surveyId: 1, participantId: 1 }` con `unique: true` (garantiza en el nivel de motor que un participante no pueda responder dos veces a la misma encuesta).
4. **Colección `contactSubmissions`:**
   - Índice temporal: `{ createdAt: -1 }` (consulta cronológica para administradores).

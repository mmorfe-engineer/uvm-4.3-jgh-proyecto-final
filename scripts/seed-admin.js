/**
 * scripts/seed-admin.js
 * Crea o verifica la cuenta de demostración del Administrador y encuestas formativas iniciales
 */
const path = require('path');
const mongoose = require(path.resolve(__dirname, '../backend/node_modules/mongoose'));
const User = require('../backend/src/models/User');
const Survey = require('../backend/src/models/Survey');

const dotenv = require(path.resolve(__dirname, '../backend/node_modules/dotenv'));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jgh_encuestas_dev';

async function seedAdmin() {
  console.log('[Seed] Conectando a MongoDB en:', mongoURI);
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Conectado exitosamente.');

    // 1. Crear o actualizar Administrador de Demostración
    const adminEmail = 'admin@uvm.edu.ve';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = new User({
        name: 'Administrador JGH (Académico)',
        email: adminEmail,
        passwordHash: 'Admin123!*', // Será procesado por el hook pre-save de bcrypt
        role: 'admin',
      });
      await admin.save();
      console.log(`[Seed] Administrador creado: ${adminEmail} (Contraseña: Admin123!*)`);
    } else {
      console.log(`[Seed] Administrador existente verificado: ${adminEmail}`);
    }

    // 2. Crear participante de demostración
    const participantEmail = 'participante@uvm.edu.ve';
    let participant = await User.findOne({ email: participantEmail });
    if (!participant) {
      participant = new User({
        name: 'Participante Estudiantil UVM',
        email: participantEmail,
        passwordHash: 'Participante123!*',
        role: 'participant',
      });
      await participant.save();
      console.log(`[Seed] Participante de prueba creado: ${participantEmail} (Contraseña: Participante123!*)`);
    } else {
      console.log(`[Seed] Participante existente verificado: ${participantEmail}`);
    }

    // 3. Crear encuestas formativas demostrativas si no existen
    const surveyCount = await Survey.countDocuments();
    if (surveyCount === 0) {
      console.log('[Seed] Creando encuestas formativas canónicas...');

      const survey1 = new Survey({
        title: 'Impacto de la Bioética y Solidaridad en la Práctica Comunitaria',
        description: 'Consulta formativa sobre la aplicabilidad del pensamiento humanista del Dr. José Gregorio Hernández en la formación universitaria.',
        topic: 'Bioética y Salud',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        questions: [
          {
            id: 'q1_1',
            text: '¿En qué medida considera que los valores de vocación y servicio del Dr. JGH son aplicables a su área de estudio?',
            type: 'single_choice',
            required: true,
            options: ['Totalmente aplicable', 'Muy aplicable', 'Moderadamente aplicable', 'Poco aplicable'],
          },
          {
            id: 'q1_2',
            text: '¿Qué iniciativa comunitaria priorizaría para fortalecer la salud integral en su localidad?',
            type: 'single_choice',
            required: true,
            options: ['Jornadas de atención primaria', 'Talleres de bioética y dignidad humana', 'Voluntariado de apoyo asistencial', 'Campañas de prevención ciudadana'],
          },
          {
            id: 'q1_3',
            text: 'Sugerencias breves para integrar la solidaridad activa en los proyectos comunitarios:',
            type: 'short_text',
            required: false,
            options: [],
          },
        ],
      });

      const survey2 = new Survey({
        title: 'Apropiación de Valores Ciudadanos y Ética de Servicio',
        description: 'Evaluación del compromiso ético y la responsabilidad cívica en la comunidad académica de la Universidad Valle del Momboy.',
        topic: 'Valores Ciudadanos',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        questions: [
          {
            id: 'q2_1',
            text: '¿Cómo califica el rol de la ética profesional en el ejercicio cotidiano?',
            type: 'single_choice',
            required: true,
            options: ['Fundamental y prioritario', 'Importante pero secundario', 'Opcional según las circunstancias'],
          },
          {
            id: 'q2_2',
            text: '¿Desea participar en las mesas de diálogo formativo de la Cátedra JGH?',
            type: 'single_choice',
            required: true,
            options: ['Sí, de forma activa', 'Sí, como oyente', 'No por el momento'],
          },
        ],
      });

      const survey3 = new Survey({
        title: 'Borrador: Proyecto de Voluntariado Médico Asistencial 2027',
        description: 'Encuesta en diseño preliminar para sondear recursos y especialistas disponibles.',
        topic: 'Salud y Asistencia',
        status: 'draft',
        createdBy: admin._id,
        questions: [
          {
            id: 'q3_1',
            text: 'Disponibilidad horaria para brigadas de fin de semana:',
            type: 'single_choice',
            required: true,
            options: ['Sábados mañana', 'Domingos mañana', 'No disponible'],
          },
        ],
      });

      await survey1.save();
      await survey2.save();
      await survey3.save();
      console.log('[Seed] Encuestas formativas iniciales creadas exitosamente.');
    } else {
      console.log(`[Seed] Base de datos ya cuenta con ${surveyCount} encuestas.`);
    }

    console.log('\n======================================================');
    console.log('[Seed] Proceso completado exitosamente.');
    console.log('Credenciales de demostración:');
    console.log('  Admin:        admin@uvm.edu.ve / Admin123!*');
    console.log('  Participante: participante@uvm.edu.ve / Participante123!*');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error durante el proceso de seed:', err);
    process.exit(1);
  }
}

seedAdmin();

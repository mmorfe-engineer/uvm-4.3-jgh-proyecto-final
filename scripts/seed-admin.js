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

    // 3. Crear o actualizar encuestas formativas canónicas (Orden V2)
    const surveyCount = await Survey.countDocuments();
    console.log(`[Seed] Encuestas actuales en BD: ${surveyCount}. Sincronizando instrumentos canónicos V2...`);

    // Limpiar encuestas para asegurar que los 3 instrumentos canónicos estén actualizados
    await Survey.deleteMany({});

    const surveyA = new Survey({
      title: 'Diagnóstico de Necesidades Formativas en Bioética y Humanismo',
      description: 'Consulta para identificar intereses temáticos, modalidades de estudio preferidas y obstáculos para la participación en programas formativos de la Cátedra.',
      objective: 'Identificar intereses temáticos, prioridades formativas, modalidades de estudio preferidas y principales obstáculos para la participación en las actividades de la Cátedra.',
      targetAudience: 'Estudiantes de pregrado, posgrado y profesionales de la región.',
      topic: 'Formación y Bioética',
      status: 'published',
      publishedAt: new Date(),
      createdBy: admin._id,
      questions: [
        {
          id: 'q_a1',
          text: '¿En cuál de las siguientes áreas temáticas considera prioritario profundizar su formación ética?',
          type: 'single_choice',
          required: true,
          options: [
            'Bioética clínica y dignidad del paciente',
            'Ética profesional en la toma de decisiones complejas',
            'Historia y fundamentación de la medicina humanista',
            'Liderazgo cívico y compromiso comunitario',
          ],
        },
        {
          id: 'q_a2',
          text: '¿Qué modalidad formativa se adapta mejor a sus compromisos cotidianos?',
          type: 'single_choice',
          required: true,
          options: [
            'Talleres intensivos presenciales de fin de semana',
            'Módulos híbridos con sesiones virtuales y encuentros mensuales',
            'Seminarios 100% asíncronos en plataforma virtual',
            'Foros de debate y mesas redondas vespertinas',
          ],
        },
        {
          id: 'q_a3',
          text: '¿Cuál identifica como el principal obstáculo para participar activamente en programas formativos extracurriculares?',
          type: 'single_choice',
          required: true,
          options: [
            'Coincidencia con carga horaria académica o laboral',
            'Limitaciones de conectividad y acceso a recursos digitales',
            'Distancia geográfica o dificultades de transporte',
            'Desconocimiento previo de la programación académica',
          ],
        },
        {
          id: 'q_a4',
          text: '¿Considera útil que las actividades formativas de la Cátedra ofrezcan certificación académica avalada por la UVM?',
          type: 'single_choice',
          required: true,
          options: [
            'Fundamental para el perfil curricular',
            'Deseable aunque no determinante',
            'Indiferente frente a la calidad del contenido',
            'No es relevante para mi interés',
          ],
        },
        {
          id: 'q_a5',
          text: '¿Con qué frecuencia desearía participar en ciclos de conferencias y discusión formativa?',
          type: 'single_choice',
          required: true,
          options: ['Mensual', 'Quincenal', 'Trimestral', 'Únicamente en jornadas especiales'],
        },
        {
          id: 'q_a6',
          text: 'Nivel de conocimiento actual sobre las obras científicas publicadas por el Dr. José Gregorio Hernández:',
          type: 'single_choice',
          required: true,
          options: [
            'Conocimiento amplio y detallado',
            'Conocimiento básico de sus líneas generales',
            'He escuchado menciones pero no conozco los textos',
            'Desconocía que hubiese publicado obras científicas',
          ],
        },
        {
          id: 'q_a7',
          text: 'Sugiera un tema o problemática contemporánea que desearía que fuese abordado en futuros seminarios:',
          type: 'short_text',
          required: false,
          options: [],
        },
      ],
    });

    const surveyB = new Survey({
      title: 'Evaluación de Actividades Académicas y Calidad Formativa',
      description: 'Instrumento para evaluar la pertinencia, claridad pedagógica, aprendizaje percibido y oportunidades de mejora en los eventos formativos de la Cátedra.',
      objective: 'Evaluar pertinencia, claridad, metodología, aprendizaje percibido y oportunidades de mejora para la programación académica de la Cátedra.',
      targetAudience: 'Participantes en conferencias, jornadas y diplomados organizados por la Cátedra.',
      topic: 'Evaluación Académica',
      status: 'published',
      publishedAt: new Date(),
      createdBy: admin._id,
      questions: [
        {
          id: 'q_b1',
          text: '¿En qué medida los contenidos expuestos respondieron a los objetivos anunciados de la actividad?',
          type: 'single_choice',
          required: true,
          options: [
            'Superaron plenamente los objetivos planteados',
            'Cumplieron adecuadamente con los objetivos',
            'Cumplieron de forma parcial',
            'No respondieron a lo anunciado',
          ],
        },
        {
          id: 'q_b2',
          text: '¿Cómo califica la claridad expositiva y el rigor pedagógico de los facilitadores?',
          type: 'single_choice',
          required: true,
          options: [
            'Excelente dominio y pedagogía',
            'Bueno y comprensible',
            'Aceptable pero susceptible de mejora',
            'Deficiente en metodología',
          ],
        },
        {
          id: 'q_b3',
          text: '¿Considera que el material bibliográfico y los recursos de apoyo fueron oportunos y de calidad académica?',
          type: 'single_choice',
          required: true,
          options: [
            'Muy pertinentes y actualizados',
            'Adecuados para el nivel formativo',
            'Básicos o insuficientes',
            'No se suministraron recursos de apoyo',
          ],
        },
        {
          id: 'q_b4',
          text: '¿En qué grado considera que la actividad contribuyó a su crecimiento ético y profesional?',
          type: 'single_choice',
          required: true,
          options: [
            'Impacto significativo y transformador',
            'Aporte positivo moderado',
            'Aporte puntual sin mayor impacto',
            'Sin impacto apreciable',
          ],
        },
        {
          id: 'q_b5',
          text: '¿La metodología empleada fomentó la reflexión crítica y la participación dialogada?',
          type: 'single_choice',
          required: true,
          options: [
            'Ampliamente participativa y reflexiva',
            'Participación moderada con espacio para preguntas',
            'Predominó el formato unidireccional',
            'No hubo espacio para intervención del participante',
          ],
        },
        {
          id: 'q_b6',
          text: '¿Recomendaría esta experiencia formativa a otros colegas o estudiantes de su área?',
          type: 'single_choice',
          required: true,
          options: ['Definitivamente sí', 'Probablemente sí', 'Dudoso', 'No la recomendaría'],
        },
        {
          id: 'q_b7',
          text: 'Describa la principal fortaleza o propuesta de mejora que observó en la organización de la actividad:',
          type: 'short_text',
          required: false,
          options: [],
        },
      ],
    });

    const surveyC = new Survey({
      title: 'Vinculación Social y Voluntariado Comunitario Universitario',
      description: 'Consulta comunitaria para identificar intereses de servicio, disponibilidad horaria, experiencias previas y áreas prioritarias de colaboración social.',
      objective: 'Identificar intereses, disponibilidad, experiencias y áreas potenciales de colaboración social comunitaria en el estado Trujillo.',
      targetAudience: 'Estudiantes, egresados, docentes y aliados comunitarios de la UVM.',
      topic: 'Vinculación Comunitaria',
      status: 'published',
      publishedAt: new Date(),
      createdBy: admin._id,
      questions: [
        {
          id: 'q_c1',
          text: '¿Ha participado en iniciativas de vinculación social promovidas por instituciones universitarias?',
          type: 'single_choice',
          required: true,
          options: [
            'Sí, de forma continua en diversas actividades',
            'Sí, exclusivamente durante el cumplimiento del servicio comunitario',
            'He participado de forma independiente en mi comunidad',
            'Aún no he tenido experiencia en proyectos de vinculación',
          ],
        },
        {
          id: 'q_c2',
          text: '¿En cuál de las siguientes áreas considera que su aporte voluntario tendría mayor impacto comunitario?',
          type: 'single_choice',
          required: true,
          options: [
            'Alfabetización digital, redes y soporte técnico comunal',
            'Promoción y prevención en salud integral y primeros auxilios',
            'Refuerzo pedagógico y animación cultural para niños y jóvenes',
            'Asesoría administrativa, jurídica y contable básica',
          ],
        },
        {
          id: 'q_c3',
          text: '¿Cuántas horas mensuales podría dedicar con regularidad a actividades de vinculación comunitaria?',
          type: 'single_choice',
          required: true,
          options: [
            'Más de 10 horas mensuales',
            'Entre 5 y 10 horas mensuales',
            'Menos de 5 horas mensuales',
            'Sin disponibilidad regular actualmente',
          ],
        },
        {
          id: 'q_c4',
          text: '¿Cuál formato de vinculación social considera más provechoso y sostenible para la comunidad?',
          type: 'single_choice',
          required: true,
          options: [
            'Acompañamiento periódico y sostenido a comunidades específicas',
            'Jornadas puntuales intensivas de fin de semana',
            'Diagnósticos técnicos y transferencia de capacidades a líderes locales',
            'Alianzas interinstitucionales con centros asistenciales',
          ],
        },
        {
          id: 'q_c5',
          text: 'Disposición para colaborar en la planificación logística o coordinación de brigadas comunitarias:',
          type: 'single_choice',
          required: true,
          options: [
            'Alta disposición para asumir roles de coordinación',
            'Disposición como colaborador operativo en campo',
            'Disposición exclusivamente para apoyo digital o remoto',
            'No puedo asumir responsabilidades de coordinación',
          ],
        },
        {
          id: 'q_c6',
          text: '¿Considera que el ideario de solidaridad del Dr. José Gregorio Hernández inspira un modelo de servicio transformador?',
          type: 'single_choice',
          required: true,
          options: [
            'Plenamente, constituye un referente ético de vocación',
            'Sí, aporta valor al compromiso cívico universitario',
            'Es un referente respetable aunque secundario',
            'No tengo criterio formado al respecto',
          ],
        },
        {
          id: 'q_c7',
          text: 'Proponga una comunidad o sector vulnerable del estado Trujillo que considere prioritario para una jornada comunitaria:',
          type: 'short_text',
          required: false,
          options: [],
        },
      ],
    });

    await surveyA.save();
    await surveyB.save();
    await surveyC.save();
    console.log('[Seed] 3 instrumentos formativos canónicos V2 guardados exitosamente en MongoDB.');

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

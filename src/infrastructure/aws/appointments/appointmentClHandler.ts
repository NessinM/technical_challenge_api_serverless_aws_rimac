import { SQSEvent } from "aws-lambda";
import mysql from "mysql2/promise";
import { SNS } from "aws-sdk";

// SNS para publicar eventos
const sns = new SNS();

export const processAppointmentCl = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    // Obtener configuración de la base de datos según el país
    const dbConfig = {
      host: process.env.RDS_HOST_CL,
      user: process.env.RDS_USER_CL,
      password: process.env.RDS_PASSWORD_CL,
      database: process.env.RDS_DATABASE_CL,
    };

    console.log('dbConfig CL', dbConfig)

    // Conectar a la base de datos específica
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Insertar en MySQL (Aurora o RDS)
      const insertQuery = `
        INSERT INTO appointment (scheduleId, insuredId, countryISO, status, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(insertQuery, [
        message.scheduleId,
        message.insuredId,
        message.countryISO,
        message.status,
        new Date(),
      ]);

      // Publicar evento en EventBridge (vía SNS)
      await sns
        .publish({
          Message: JSON.stringify({
            scheduleId: message.scheduleId,
            status: "completed",
          }),
          TopicArn: process.env.APPOINTMENT_EVENT_TOPIC_ARN!,
        })
        .promise();

      console.log(`✔️ Guardado y publicado: ${message.scheduleId}`);
    } catch (err) {
      console.error(`❌ Error al procesar ${message.scheduleId}:`, err);
    } finally {
      await connection.end();
    }
  }
};

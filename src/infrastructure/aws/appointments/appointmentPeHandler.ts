import { SQSEvent } from "aws-lambda";
import mysql from "mysql2/promise";
import { SNS } from "aws-sdk";

// SNS para publicar eventos
const sns = new SNS();

export const processAppointmentPe = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    const message = JSON.parse(payload.Message);

    const scheduleId = message.scheduleId || null;
    const insuredId = message.insuredId || null;
    const countryISO = message.countryISO || null;

    // Validar si hay valores faltantes
    if (!scheduleId || !insuredId || !countryISO) {
      console.error("❌ Missing required data:", {
        scheduleId,
        insuredId,
        countryISO,
      });
      continue; // Saltar al siguiente registro si falta algún dato
    }

    // Obtener configuración de la base de datos según el país
    // const dbConfig = {
    //   host: process.env.RDS_HOST_PE,
    //   user: process.env.RDS_USER_PE,
    //   password: process.env.RDS_PASSWORD_PE,
    //   database: process.env.RDS_DATABASE_PE,
    // };

    // Conectar a la base de datos específica
    // const connection = await mysql.createConnection(dbConfig);

    try {
      // Insertar en MySQL (Aurora o RDS)
      // const insertQuery = `
      //   INSERT INTO appointment (scheduleId, insuredId, countryISO, timestamp)
      //   VALUES (?, ?, ?, ?)
      // `;
      // await connection.execute(insertQuery, [
      //   scheduleId,
      //   insuredId,
      //   countryISO,
      //   new Date(),
      // ]);

      console.log('INSERT PE IN MYSQL', [
        scheduleId,
        insuredId,
        countryISO,
        new Date(),
      ])
      console.log('process.env.APPOINTMENT_EVENT_TOPIC_ARN', process.env.APPOINTMENT_EVENT_TOPIC_ARN)

      // Publicar evento en EventBridge (vía SNS)
      try {
        await sns
        .publish({
          Message: JSON.stringify({
            scheduleId: scheduleId,
            status: "completed",
          }),
          TopicArn: process.env.APPOINTMENT_EVENT_TOPIC_ARN!,
          MessageAttributes: {
            countryISO: {
              DataType: "String",
              StringValue: "PE", // o "CL", según el país correspondiente
            },
          },
        })
        .promise();


        console.log(`✔️ Evento publicado: ${scheduleId}`);
      } catch (snsError) {
        console.error(
          `❌ Error al publicar evento en SNS para ${scheduleId}:`,
          snsError
        );
      }

      console.log(`✔️ Guardado y publicado: ${scheduleId}`);
    } catch (err) {
      console.error(`❌ Error al procesar ${scheduleId}:`, err);
    } finally {
      // await connection.end();
    }
  }
};

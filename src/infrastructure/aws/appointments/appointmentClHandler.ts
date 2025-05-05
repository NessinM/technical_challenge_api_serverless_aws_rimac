import { SQSEvent } from "aws-lambda";
import mysql from "mysql2/promise";
import { SNS } from "aws-sdk";

// SNS para publicar eventos
const sns = new SNS();

export const processAppointmentCl = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    const message = JSON.parse(payload.Message);
    console.log("message -> processAppointmentCl : ", message);

    const scheduleId = message.scheduleId || null;
    const insuredId = message.insuredId || null;
    const countryISO = message.countryISO || null;

    // Validar si hay valores faltantes
    if (!scheduleId || !insuredId || !countryISO) {
      console.error("❌ Missing required data | CL:", {
        scheduleId,
        insuredId,
        countryISO,
      });
      continue; // Saltar al siguiente registro si falta algún dato
    }

    // Obtener configuración de la base de datos según el país
    // const dbConfig = {
    //   host: process.env.RDS_HOST_CL,
    //   user: process.env.RDS_USER_CL,
    //   password: process.env.RDS_PASSWORD_CL,
    //   database: process.env.RDS_DATABASE_CL,
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

      console.log("INSERT CL IN MYSQL", [
        scheduleId,
        insuredId,
        countryISO,
        new Date(),
      ]);
      console.log(
        "process.env.APPOINTMENT_EVENT_TOPIC_ARN",
        process.env.APPOINTMENT_EVENT_TOPIC_ARN
      );

      // Publicar evento en EventBridge (vía SNS)
      try {
        console.log("--------------------------------")
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
                StringValue: "CL",
              },
            },
          })
          .promise();

        console.log(`✔️ Evento publicado: ${scheduleId}`);
        console.log("-------------------------------")
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

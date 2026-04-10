const { Kafka, Partitioners } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'ubereats-producer',
  brokers: [process.env.KAFKA_BROKER || 'kafka-service:9092'],
  createPartitioner: Partitioners.LegacyPartitioner,
});
const producer = kafka.producer();
const sendOrderEvent = async (orderData) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'order-events',
      messages: [{ value: JSON.stringify(orderData) }],
    });
    console.log(`Order event sent: ${orderData.order_status} for order ${orderData.order_id}`);
    await producer.disconnect();
  } catch (error) {
    console.error('Error sending order event:', error);
  }
};
module.exports = { sendOrderEvent };

















// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'ubereats-producer',
//   brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
// });

// const producer = kafka.producer();

// const sendOrderEvent = async (orderData, status = 'Received') => {
//   try {
//     await producer.connect();

//     const messagePayload = {
//       ...orderData,
//       status, 
//       timestamp: new Date().toISOString(),
//     };

//     await producer.send({
//       topic: 'order-events',
//       messages: [{ value: JSON.stringify(messagePayload) }],
//     });

//     console.log('Order event sent:', messagePayload);
//     await producer.disconnect();
//   } catch (error) {
//     console.error('Error sending order event:', error);
//   }
// };

// module.exports = { sendOrderEvent };
// const { Kafka } = require('kafkajs');
// const mongoose = require('mongoose');
// const Order = require('../models/order');
// const kafka = new Kafka({
//   clientId: 'ubereats-consumer',
//   brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
// });
// const consumer = kafka.consumer({ groupId: 'order-group' });
// const consumeOrderEvents = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'order-events', fromBeginning: true });
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         const orderData = JSON.parse(message.value.toString());
//         console.log(`Received order event: ${orderData.order_status} for order ${orderData.order_id}`);
        
//         // Define status progression
//         const statusOrder = ['Order Received', 'Order Preparing', 'Ready to Deliver', 'Delivered'];
//         const currentStatus = orderData.order_status;
//         const currentIndex = statusOrder.indexOf(currentStatus);
        
//         // Update to the next status if not the final one
//         if (currentIndex < statusOrder.length - 1) {
//           const nextStatus = statusOrder[currentIndex + 1];
//           await Order.findByIdAndUpdate(orderData.order_id, { order_status: nextStatus });
//           console.log(`Updated order ${orderData.order_id} to status: ${nextStatus}`);
//           // Send event for the next status
//           await require('./producer').sendOrderEvent({
//             order_id: orderData.order_id,
//             user_id: orderData.user_id,
//             restaurant_id: orderData.restaurant_id,
//             total_price: orderData.total_price,
//             delivery_address: orderData.delivery_address,
//             order_status: nextStatus,
//           });
//         }
//       } catch (error) {
//         console.error('Error processing order event:', error);
//       }
//     },
//   });
// };
// module.exports = { consumeOrderEvents };


const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Order = require('../models/order');

const kafka = new Kafka({
  clientId: 'ubereats-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka-service:9092'],
});
const consumer = kafka.consumer({ groupId: 'order-group' });

const consumeOrderEvents = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const orderData = JSON.parse(message.value.toString());
        console.log(`Received order event: ${orderData.order_status} for order ${orderData.order_id}`);
        // No automatic status update; frontend will handle status changes manually
      } catch (error) {
        console.error('Error processing order event:', error);
      }
    },
  });
};

module.exports = { consumeOrderEvents };
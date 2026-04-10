const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'topic-creator',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const createTopic = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: 'order-events',
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
    console.log('Topic order-events created successfully');
  } catch (error) {
    if (error.type === 'TOPIC_ALREADY_EXISTS') {
      console.log('Topic order-events already exists');
    } else {
      console.error('Error creating topic:', error);
    }
  } finally {
    await admin.disconnect();
  }
};

createTopic().catch(console.error);
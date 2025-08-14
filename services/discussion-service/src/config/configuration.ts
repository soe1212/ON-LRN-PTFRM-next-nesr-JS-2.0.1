export default () => ({
  port: parseInt(process.env.PORT, 10) || 4008,
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/discussions',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: parseInt(process.env.CONSUL_PORT, 10) || 8500,
  },
});
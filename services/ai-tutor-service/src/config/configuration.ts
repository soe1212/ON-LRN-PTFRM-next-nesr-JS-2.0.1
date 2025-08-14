export default () => ({
  port: parseInt(process.env.PORT, 10) || 4018,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ai_tutor',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: parseInt(process.env.CONSUL_PORT, 10) || 8500,
  },
});
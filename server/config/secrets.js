const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

async function loadSecrets() {
  const secretName = process.env.AWS_SECRET_NAME;
  const region = process.env.AWS_REGION || 'us-east-1';

  if (!secretName) {
    console.log('No AWS_SECRET_NAME set, using environment variables.');
    return;
  }

  console.log(`Loading secrets from Secrets Manager: ${secretName}`);

  const client = new SecretsManagerClient({ region });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );

  const secrets = JSON.parse(response.SecretString);

  const keyMap = {
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_NAME: 'DB_NAME',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    AWS_REGION: 'AWS_REGION',
    S3_BUCKET_NAME: 'S3_BUCKET_NAME',
  };

  for (const [secretKey, envKey] of Object.entries(keyMap)) {
    if (secrets[secretKey]) {
      process.env[envKey] = secrets[secretKey];
    }
  }

  console.log('Secrets loaded successfully.');
}

module.exports = { loadSecrets };

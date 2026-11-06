//credencias .env + banco de teste
require('dotenv').config({ quiet: true });
process.env.PG_DATABASE = 'web2_db_test';
const db = require('../config/db_sequelize');

test('conecta no PostgreSQL de teste', async () => {
    await db.sequelize.authenticate();

    //confirma que estou no banco de teste
    expect(db.sequelize.config.database).toBe('web2_db_test');
});

//fecha conexão
afterAll(async () => {
    await db.sequelize.close();
});
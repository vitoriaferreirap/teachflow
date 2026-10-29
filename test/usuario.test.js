//credencias postgres
require('dotenv').config({ quiet: true });
//troca para banco de teste
process.env.PG_DATABASE = 'web2_db_test';
//carrega banco trazendo db.usuario
const db = require('../config/db_sequelize');

//roda uma vez antes de todos os testes
beforeAll(async () => {
    //force true, apaga tabelas e cria de novo, vazias
    await db.sequelize.sync({ force: true });
})

// TESTE 1 com três conferencias, ok se todos passarem.
test("ao criar professora, a senha é salva como hash no bd", async () => {
    //acao de criar professora
    const usuario = await db.Usuario.create({
        login: "professorUm",
        senha: "1234",
        tipo: 1,
    });

    //conferir se a senha salva NÃO é a senha digitada
    // nao pode ser essa senha, devido a tranformacao hash pelo hook
    expect(usuario.senha).not.toBe("1234");

    //a senha salva não pode ser a original: o hook beforeSave troca ela pelo hash
    //conferir se a senha salva comeca com "$2" formato bcrypt
    expect(usuario.senha).toMatch(/^\$2/);

    //confere se mesmo em hash a senha ainda é valida
    expect(await usuario.senhaConfere("1234")).toBe(true);
});



//roda uma vez depois de todos os testes
afterAll(async () => {
    //fecha conexao, sem isso jest fica travo no fim
    await db.sequelize.close();
})
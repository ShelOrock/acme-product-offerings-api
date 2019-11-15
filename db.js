const Sequelize = require('sequelize');
const { STRING, DECIMAL, UUID, UUIDV4 } = Sequelize;

const conn = new Sequelize('postgres://localhost:5432/acmeofferings', {
    logging: false
});

const idParam = {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
}

const nameParam = {
    type: STRING,
    allowNull: false,
    unique: true,
}

const Product = conn.define('product', {
    id: idParam,
    name: nameParam,
    suggestedPrice: {
        type: DECIMAL,
        allowNull: false,
    },
});

const Company = conn.define('company', {
    id: idParam,
    name: nameParam,
});

const Offering = conn.define('offering', {
    id: idParam,
    price:{
        type: DECIMAL,
        allowNull: false
    }
})

Product.belongsToMany(Company, { through:'offering' });
Company.belongsToMany(Product, { through:'offering' });

const seedAndSync = async () => {
    await conn.sync( { force: true })

    const companies = [
        { name: 'ACME US' },
        { name: 'ACME GLOBAL' },
        { name: 'ACME TRI-STATE' }
    ]

    const products = [
        { name: 'foo', suggestedPrice: 3 },
        { name: 'bar', suggestedPrice: 5 },
        { name: 'bazz', suggestedPrice: 9 }
    ]

    const [ acmeUs, acmeGlobal, acmeTristate] = await Promise.all( companies.map(company => Company.create(company)));
    const [ foo, bar, bazz ] = await Promise.all( products.map(product => Product.create(product)));

    const offerings = [
        { companyId: acmeUs.id, productId: foo.id, price: 2.9 },
        { companyId: acmeGlobal.id, productId: foo.id, price: 2.8 },
        { companyId: acmeGlobal.id, productId: bar.id, price: 4.5 },
        { companyId: acmeTristate.id, productId: bazz.id, price: 11 }
    ]

    await Promise.all( offerings.map( offering => Offering.create(offering)));
}

module.exports = {
    seedAndSync,
    Product,
    Company,
    Offering
}
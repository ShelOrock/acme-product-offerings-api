const Sequelize = require('sequelize');
const { STRING, DECIMAL, UUID, UUIDV4 } = Sequelize;

const conn = new Sequelize('postgres://localhost:5432/acmeofferings', {
    logging: false
});

const Product = conn.define('product', {
    id: {
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    suggestedPrice: {
        type: DECIMAL,
        allowNull: false,
    },
});

const Company = conn.define('company', {
    id:{
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
    },
    name:{
        type: STRING,
        allowNull:false,
        unique: true
    }
});

const Offering = conn.define('offering', {
    price:{
        type: DECIMAL,
        allowNull: false
    }
})

Product.belongsToMany(Company, {through:'offering', as:'companyOffering'});
Company.belongsToMany(Product, {through:'offering', as:'companyOffering'});

const seed = async () => {
    const productOne = await Product.create(
        {
            name:'foe',
            suggestedPrice: 4
        }
    );
    const productTwo = await Product.create(
        {
            name: 'moe',
            suggestedPrice: 5
        }
    );
    const companyOne = await Company.create(
        {
            name: 'ACME US'
        }
    );
    const companyTwo = await Company.create(
        {
            name: 'ACME GLOBAL'
        }
    );
    const offeringOne = await Offering.create(
        {
            price: 11,
            productId: productOne.id,
            companyId: companyOne.id,
        }
    );
    const offeringTwo = await Offering.create(
        {
            price: 14,
            productId: productTwo.id,
            companyId: companyTwo.id
        }
    );
}

const seedAndSync = async () => {
    return conn.sync( { force: true })
    .then(() => seed())
    .catch(e => console.log(e))
}

module.exports = {
    seedAndSync,
    Product,
    Company,
    Offering
}
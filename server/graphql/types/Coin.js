

const typeDef = `
type Query {
    coins: [Coin]
}

type Coin {
    symbol: String
}
`;

module.exports = typeDef;
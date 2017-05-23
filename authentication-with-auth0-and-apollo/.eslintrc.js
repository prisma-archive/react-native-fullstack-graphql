module.exports = {
    "extends": "airbnb",
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "graphql"
    ],
    "rules": {
        "graphql/template-strings": ['error', {
            // Import default settings for your GraphQL client. Supported values:
            // 'apollo', 'relay', 'lokka', 'literal'
            env: 'apollo',

            // Import your schema JSON here
            schemaJson: require('./schema.json'),

            // OR provide absolute path to your schema JSON
            // schemaJsonFilepath: path.resolve(__dirname, './schema.json'),

            // tagName is gql by default
        }],
        "semi": 0,
        "comma-dangle": 0,
        "no-use-before-define": 0,
        "react/prefer-stateless-function": 0,
        "react/jsx-filename-extension": 0,
        "react/sort-comp": 0,
        "no-underscore-dangle": 0
    }
};
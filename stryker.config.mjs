// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: "jest",
  reporters: ["progress", "clear-text", "html"],
  coverageAnalysis: "off", 
  concurrency: 1, 
  mutate: [ 
    "src/react_redux/actions/AttivitaActions.js",
    "src/react_redux/actions/AutenticazioneActions.js",
    "src/react_redux/actions/CarrelloActions.js",
    "src/react_redux/actions/CartaActions.js",
    "src/react_redux/actions/ClienteActions.js",
    "src/react_redux/actions/OrdineActions.js",
    "src/react_redux/actions/ServizioActions.js",
    "src/react_redux/actions/SpesaActions.js",
    "src/react_redux/actions/StileActions.js",
  ], 
  jest: {
    projectType: "custom", 
    configFile: "jest.config.mjs", 
  },
};
export default config;

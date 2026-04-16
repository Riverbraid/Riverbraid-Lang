const { verify } = require('./riverbraid-core/run-vectors.cjs');
async function executeStationaryChain(chain, input) {
  const result = await chain.invoke(input);
  verify();
  return result;
}
module.exports = { executeStationaryChain };

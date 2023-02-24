const generator = require('generate-password');


exports.mdpToken = generator.generate({
    length: 60,
    numbers: true,
    symbols: true
});

module.exports.console = function () {console.log(this.mdpToken)};
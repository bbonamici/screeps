/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.logger');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    info: function(msg)
    {
        console.log('[INFO] ' + msg);
    },
    err: function(msg)
    {
        console.log('[ERROR] ' + msg);
    },
    warn: function(msg)
    {
        console.log('[WARN] ' + msg);
    },
    trace: function(msg)
    {
        var tmp = 1;
        console.log('[TRACE] ' + msg);
    }
};
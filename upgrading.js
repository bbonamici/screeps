/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrading');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    upgrade: function(creep, home)
    {
        var logguer = require('util.logger');
        
        var actionState = creep.upgradeController(home.controller);
        if(actionState == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(home.controller);
        }
        
        if(creep.carry.energy == 0)
        {
            creep.memory.state = 'pickup';
            creep.memory.nextState = null;
            creep.memory.targetId = null;
        }
        
    }
};
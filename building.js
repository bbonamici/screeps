/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('building');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    build: function(creep, home)
    { 
        var logger = require('util.logger');
        
         if(creep.memory.targetId == null)
        {
            var conSites = home.find(FIND_MY_CONSTRUCTION_SITES);
            logger.trace(conSites);
            if(conSites.length > 0) {
                creep.memory.targetId = conSites[0].id;
            }    
        }
        
        var target = Game.getObjectById(creep.memory.targetId);
        
        if(target == null)
        {
            creep.memory.targetId = null;
            logger.err("target ended up being null. No stuff to build " + creep.name);
            creep.memory.state = null;
            return;
        }
        
        var actionState = creep.build(target);
        
        logger.trace('build - transferState ' + actionState);
        if(actionState == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
        else if(actionState == ERR_NOT_ENOUGH_RESOURCES)
        {
            creep.memory.targetId = null;
            creep.memory.state = 'pickup';
            creep.memory.nextState = 'building';

            return;
        }
        else
        {
            creep.memory.targetId = null;
        }
        
        if(creep.carry.energy == 0)
        {
            //TODO cambiar a nextState?
            creep.memory.state = 'pickup';
            creep.memory.nextState = 'building';
            creep.memory.targetId = null;
        }
    }
};
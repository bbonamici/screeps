/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('repairing');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    repair: function(creep, home)
    {
        var logger = require('util.logger');
         if(creep.memory.targetId == null)
        {
            var structureArray = [];
            
            //roads
            structureArray = structureArray.concat(home.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART && 
                        structure.hits < structure.hitsMax && 
                        structure.hits < Memory.max_fortificationsHP);
                    }
            }));
            
            
            //structures 
            structureArray = structureArray.concat(home.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((   structure.structureType != STRUCTURE_WALL && 
                                structure.structureType != STRUCTURE_RAMPART ) && 
                                structure.hits < structure.hitsMax);
                }
            }));
            logger.trace(structureArray);
            
            if(structureArray.length > 0)
            {
                creep.memory.targetId = structureArray[0].id;   
            }
            else
            {
                creep.memory.state = 'upgrading';
                creep.memory.nextState = null;
                creep.memory.targetId = null;
                return;
            }
        }
        
        var target = Game.getObjectById(creep.memory.targetId);
        var stateAction = creep.repair(target);
   
        if(stateAction == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        } 
        
        if(stateAction == ERR_NOT_ENOUGH_RESOURCES || 
                creep.carry.energy == 0 )
        {
            logger.trace(stateAction);
            creep.memory.state = 'pickup';
            creep.memory.nextState = null;
            creep.memory.targetId = null;
        }
        
        if(target.hits == target.hitsMax || target.hits >= Memory.max_fortificationsHP)
        {
            creep.memory.targetId = null;
        }
    }
};
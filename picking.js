/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('picking');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    pickup : function(creep, home)
    {
        var logger = require('util.logger');
        //if the targetId is null, means we need to pick a target
        if(creep.memory.targetId == null)
        {
            logger.trace("memory targetId == null");
            //get a list of all containers with some energy on it.
            const MINIMUM_ENERGY_STORAGE = 500;
            var containers = home.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || 
                        structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > MINIMUM_ENERGY_STORAGE }});
            
            logger.trace('containers available:' + containers.length);
            //if there is actually containers
            if(containers.length > 0)
            {
                //sort them
                var sortedContainers = containers.sort(function(a, b) 
                    { return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]; });
                
                //save state
                creep.memory.targetId = sortedContainers[0].id;
            }
            else
            {
                // no hay nada para levantar, minando entonces!
                creep.memory.targetId = null
                creep.memory.state = 'mining';
                creep.memory.nextState = 'building';
            }
        }
        
        //get the target.
        var target = Game.getObjectById(creep.memory.targetId);
        if(target == null)
        {
            logger.err("target ended up being null." + creep.name);
            return;
        }
        
        //get stuff.
        var actionState = creep.withdraw(target, RESOURCE_ENERGY);
        
        logger.trace('pickup - transferState ' + actionState);
        if(actionState == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
        else if(actionState == ERR_NOT_ENOUGH_RESOURCES)
        {
            creep.memory.targetId = null;
            return;
        }
        else
        {
            creep.memory.targetId = null;
        }
        
        if(creep.carry.energy == creep.carryCapacity)
        {
            //TODO cambiar a nextState?
            creep.memory.state = 'building';
            creep.memory.targetId = null;
            creep.memory.nextState = null;
        }
    }
};
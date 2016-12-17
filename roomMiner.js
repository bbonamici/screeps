/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomMiner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run : function(creep, home)
    {
        var logger = require('util.logger');
         if(creep.memory.home == null){
            logger.error("Creep " + creep.name + ' has no home defined! - builder');
            return;
        }

        var home = Game.rooms[creep.memory.home];
        
        logger.trace("state: " + creep.memory.state);
        
        
        if(creep.memory.minerId == null)
        {
                    
            var energySourceArrayCount = [];
            var arr = home.find(FIND_SOURCES);
            
            for(var a = 0; a < arr.length; a++)
            {
                energySourceArrayCount[a] = 0;
            }
            var miningCreeps = [];
                miningCreeps = miningCreeps.concat(creep.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return (creep.memory.minerId != null);
                    }
                }));
            
        
            for(var a = 0; a < miningCreeps.length; a++)
            {
                energySourceArrayCount[miningCreeps[a].memory.minerId]++;
            }
            
            var lowest = 1000;
            var lowestIndex = -1
            
            for(var a = 0; a < energySourceArrayCount.length; a++)
            {
                if(energySourceArrayCount[a] < lowest)
                {
                    lowest = energySourceArrayCount[a];
                    lowestIndex = a;
                }
            }
            if(lowestIndex == -1)
            {
                logger.error("roomMiner error: lowest index should NOT be -1");
            }
            creep.memory.minerId = lowestIndex;
        }
        
        //check for droppings?
        var droppings = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 0)
        console.log('drop' + droppings);
        if(droppings.length > 0)
        {
            creep.pickup(droppings[0]);
        }
        
        var energySource = home.find(FIND_SOURCES)[creep.memory.minerId];
        var stateTransfer = creep.harvest(energySource);
        
        // creep.say(stateTransfer);
        if(stateTransfer == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(energySource);
        }

        if(creep.carry.energy == creep.carryCapacity)
        {
            var closestContainer = energySource.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    }
                    });
                
            logger.trace('container:' + closestContainer);
            if(closestContainer != null)
            {
                
                var state = creep.transfer(closestContainer[0], RESOURCE_ENERGY);
                // creep.say(state);
                if(state == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestContainer);
                }
            }

        }
        
    }
};
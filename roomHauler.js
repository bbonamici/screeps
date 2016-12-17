/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomHauler');
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
        
        if(creep.memory.delivering == null || creep.memory.delivering == false)
        {
            if(creep.memory.haulerId == null)
            {
                        
                var energySourceArrayCount = [];
                var arr = home.find(FIND_SOURCES);
                
                for(var a = 0; a < arr.length; a++)
                {
                    energySourceArrayCount[a] = 0;
                }
                var haulingCreeps = [];
                    haulingCreeps = haulingCreeps.concat(creep.room.find(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.haulerId != null);
                        }
                    }));
                
            
                for(var a = 0; a < haulingCreeps.length; a++)
                {
                    energySourceArrayCount[haulingCreeps[a].memory.haulerId]++;
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
                    logger.error("roomHauler error: lowest index should NOT be -1");
                }
                creep.memory.haulerId = lowestIndex;
            }
            
            var energySource = home.find(FIND_SOURCES)[creep.memory.haulerId];
            //check for droppings?
            var droppings = energySource.pos.findInRange(FIND_DROPPED_RESOURCES, 3)
            console.log('drop' + droppings);
            if(droppings.length > 0)
            {
                var state = creep.pickup(droppings[0]);
                if(state == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(droppings[0]);
                    creep.pickup(droppings[0]);
                    
                };
            }
            
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.delivering = true;
                this.run(creep, home);
                return;
            }
            
            var closestContainer = energySource.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0);
                    }
                    });
                
            logger.trace('container:' + closestContainer);
            if(closestContainer != null)
            {
                var state = creep.withdraw(closestContainer[0], RESOURCE_ENERGY);
                if(creep.carry.energy == creep.carryCapacity)
                {
                    creep.memory.delivering = true;
                    return;
                }
                // creep.say(creep.memory.delivering);   
                if(state == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestContainer[0]);
                    creep.withdraw(closestContainer[0], RESOURCE_ENERGY);
                
                }
            }
            

            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.delivering = true;
                return;
            }
        }
        else
        {
            var closestSpawningStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN || 
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                    }
                    });
                
            // logger.trace('closestSpawningStructure:' + closestSpawningStructure.id);
            if(closestSpawningStructure != null)
            {
                
                var state = creep.transfer(closestSpawningStructure, RESOURCE_ENERGY);
                if(creep.carry.energy == 0)
                {
                    creep.memory.delivering = false;
                    this.run(creep, home);
                    return;
                }
                // creep.say(state);
                if(state == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestSpawningStructure);
                }
                return;
                
            }
            
            closestSpawningStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE &&
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    }
                    });
            if(closestSpawningStructure != null)
            {
                
                var state = creep.transfer(closestSpawningStructure, RESOURCE_ENERGY);
                if(creep.carry.energy == 0)
                {
                    creep.memory.delivering = false;
                    // this.run(creep, home);
                    return;
                }
                creep.say(state);
                if(state == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestSpawningStructure);
                }
            }
            
            if(creep.carry.energy == 0)
            {
                creep.memory.delivering = false;
            }
        }
        
    }
};
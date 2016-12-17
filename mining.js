/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('mining');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    mine: function(creep, home)
    {
        var logger = require('util.logger');
        
        if(creep.memory.targetId == null)
        {
                    
            //array containing energy sources with actual energy.
            var energySourceArray = [];
            var energySourceArrayCount = [];
            var arr = home.find(FIND_SOURCES);
            var energySourceWithEnergyCounter = 0;
            var energySourceWithEnergyIndex = -1;
            
            for(var a = 0; a < arr.length; a++)
            {
                energySourceArrayCount[a] = 0;
                energySourceArray[a] = arr[a].energy;
                if(arr[a].energy > 0) { 
                    energySourceWithEnergyCounter++; 
                    energySourceWithEnergyIndex = a;
                }
                console.log('index: ' + a + 'energy:' + energySourceArray[a]);
            }
            
            if(energySourceWithEnergyCounter > 1)
            {
            
                //searching for creeps that want to mine.
                var miningCreeps = [];
                miningCreeps = miningCreeps.concat(creep.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return (creep.memory.targetId != null) && creep.memory.state == 'mining';
                    }
                }));
        
                console.log(miningCreeps);
    
    
                for(var a = 0; a < miningCreeps.length; a++)
                {
                    console.log(miningCreeps[a].name + ' mining on ' + miningCreeps[a].memory.energySource);
                    energySourceArrayCount[miningCreeps[a].memory.targetId]++;
                
                }
                
                var lowest = 1000;
                var lowest_index = -1;
                
                for( var a = 0; a < energySourceArrayCount.length; a++)
                {
                    //console.log('energy source ' + a + ': ' + energySourceArrayCount[a] + ' comparing to the current lowest ' + lowest);
                    if(lowest > energySourceArrayCount[a])
                    {
                        lowest = energySourceArrayCount[a];
                        lowest_index = a;
                    }
                }
                 //console.log('lowest is ' + energySourceArrayCount);
                // no one is mining / there is no stuff!
                if(lowest_index == -1)
                {   
                    lowest = 0;
                    for(var a = 0; a < energySourceArray.length; a++)
                    {
                        if(energySourceArray[a] > lowest)
                        {
                            lowest = energySourceArray[a];
                            lowest_index = a;
                        }
                    }
                    if(lowest_index == -1)
                    {
                        console.log('no resources');
                        return;
                    }
                }
                creep.memory.targetId = lowest_index;
            }
            else if (energySourceWithEnergyCounter == 1)
            {
                creep.memory.targetId = energySourceWithEnergyIndex;
            }
            else
            {

            }
        }
        
        var energySource = home.find(FIND_SOURCES)[creep.memory.targetId];
        var stateTransfer = creep.harvest(energySource);
        
        // creep.say(stateTransfer);
        if(stateTransfer == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(energySource);
        }
        else if(stateTransfer == ERR_NOT_ENOUGH_RESOURCES)
        {
            creep.memory.targetId = null;
        }
        
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.targetId = null;
            //TODO cambiar esto a next state?
            creep.memory.state = creep.memory.nextState;
            creep.memory.nextState = null;
        }

    }
};
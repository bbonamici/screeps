var logger = require('util.logger');
var utils = require('utils');
var spawner = require('spawner');
var builder = require('builder');
var roomMiner = require('roomMiner');
var roomHauler = require('roomHauler');

module.exports.loop = function () {

    // try{

        logger.trace('Main loop start');
        
        utils.cleanMemory();
        
        
        Memory.maxFortificationHp = 1000;
        
        logger.trace('find available rooms');
        // Find available rooms
        for(var roomName in Game.rooms)
        {
            let aRoom = Game.rooms[roomName];
            
            var x = 30;
            var y = 30;
            
            var look = aRoom.lookForAtArea(LOOK_STRUCTURES, x-1,y-1 , x+1,y+1, true);
            
            // console.log(look.length);
            for(var struct in look)
            {
                if(look[struct].structure.structureType == STRUCTURE_EXTENSION)
                {
                    console.log(look[struct].structure.energy);
                }
                
            }
            
            logger.trace('Processing room: ' + aRoom.name);
            
            var conSites = aRoom.find(FIND_MY_CONSTRUCTION_SITES);
            // logger.trace(conSites);
            
            
            //building setup
            var max_builders = 0;
            var builders =  _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home == roomName}).length;
            if(builders < max_builders)
            {
                 spawner.spawn('builder', roomName, spawner.buildWorker(1))
            }
            
            //mining setup
            var miners = _.filter(Game.creeps, function(creep) {return creep.memory.role == 'miner' && creep.memory.home == roomName}).length;
            var max_miners = 6;//aRoom.find(FIND_SOURCES).length * 2;
            
            logger.trace('miners:' + miners + '/' + max_miners);
            
            if(miners < max_miners)
            {
                spawner.spawn('miner', roomName, spawner.buildMiner(2))
            }
            
            
            //haulers setup
            var haulers = _.filter(Game.creeps, function(creep) {return creep.memory.role == 'hauler' && creep.memory.home == roomName}).length;
            var max_haulers = 1;//aRoom.find(FIND_SOURCES).length * 2;
            
            logger.trace('haulers:' + haulers + '/' + max_haulers);
            
            if(haulers < max_haulers)
            {
                spawner.spawn('hauler', roomName, spawner.buildHauler(2))
            }


            for(var creepName in Game.creeps)
            {
                var aCreep = Game.creeps[creepName];
                if(aCreep.memory.role == 'builder')
                {
                    builder.run(aCreep);
                }
                if(aCreep.memory.role == 'miner')
                {
                    roomMiner.run(aCreep);
                }
                if(aCreep.memory.role == 'hauler')
                {
                    roomHauler.run(aCreep);
                }
            }

        }
        
        
        
        
        logger.trace('Main loop end');
    // } 
    // catch (err)
    // {
    //     logger.err("MAIN LOOP :" + err);
    // }

    // console.log();
}
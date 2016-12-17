/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */
var logger = require('util.logger');
module.exports = {
    spawn: function(role, homeRoomName, profile)
    {
        if(Memory.creepCounter == null) { Memory.creepCounter = 0; }
        
        //TODO: reemplazar esto
        var spawn = Game.spawns['Spawn1'];
        var controllerLevel = spawn.room.controller.level;

        var newCreepName = homeRoomName + '_' + role + '_' + Memory.creepCounter;
        
        if(spawn.canCreateCreep(profile, newCreepName) == 0)
        {
             Memory.creepCounter++;
            spawn.createCreep(profile, newCreepName, {role: role, home: homeRoomName });    
        }
    },
    
    buildWorker: function(size)
    {
        logger.trace('build worker');
        var template = [WORK, CARRY, MOVE];
        return this.buildTemplate(size, template);
    },
    
    buildMiner: function(size)
    {
        logger.trace('build miner');
        var template = [WORK, WORK, CARRY, MOVE];
        return this.buildTemplate(size, template);
    },
    
    buildHauler: function(size)
    {
        logger.trace('build hauler');
        var template = [CARRY, CARRY, CARRY, MOVE, MOVE];
        return this.buildTemplate(size, template);
    },
    
    buildTemplate: function(size, template)
    {
        logger.trace('build template');
        var body = [];
        
        for(var a = 0; a < size; a++)
        {
            body = body.concat(template);
            logger.trace('appending ' + template);
        }
        
        logger.trace('finished build. Size: ' + size + ' Body: ' + body);
        return body;
        
    }
    

    
};
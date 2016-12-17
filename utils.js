var logger = require('util.logger');
var utils = {
    // calculation
    calculateCreepCost: function(profile) 
    {
        var cost = 0;
        for(a = 0; a < profile.length; a++ )
        {
            cost = cost + BODYPART_COST[ profile[a] ];
        }
        return cost;
    },

    cleanMemory: function()
    {
        logger.trace('clean memory');
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    
    findCreepRoleInroom: function(role, room)
    {
        //  return _.filter(Game.creeps, (creep) => {creep.memory.role == 'builder');
    }

};

module.exports = utils;
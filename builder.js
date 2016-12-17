

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */
var logger = require('util.logger');
module.exports = {
    run: function(creep)
    {
        if(creep.memory.home == null){
            logger.error("Creep " + creep.name + ' has no home defined! - builder');
            return;
        }

        var home = Game.rooms[creep.memory.home];
        
        logger.trace("state: " + creep.memory.state);
        
        switch(creep.memory.state)
        {
            case 'building':
                logger.trace(creep.name + " -> building")
                
                var building = require('building');
                building.build(creep, home);
                
                
                break;
            // case 'repairing':
            //     logger.trace(creep.name + " -> repairing")
            //     var repairing = require('repairing');
            //     repairing.repair(creep, home);
                
            //     break;
            case 'upgrading': 
                logger.trace(creep.name + " -> upgrading")
                
                var upgrading = require('upgrading');
                upgrading.upgrade(creep, home);

                break;
            case 'mining':
                logger.trace(creep.name + " -> mining")
                var mining = require('mining');
                mining.mine(creep, home);
                
               
                break;
            case 'pickup':
                logger.trace(creep.name + " -> pickup")
                
                var picking = require('picking');
                picking.pickup(creep, home);
                
                
                break;
            default:
                logger.trace(creep.name + " -> default");
                
                
                
                //first, see if stuff needs to be built:
                var conSites = home.find(FIND_MY_CONSTRUCTION_SITES);
                if(conSites.length > 0)
                {
                    creep.memory.state = "building";
                    creep.memory.nextState = null;
                    creep.memory.targetId = null;
                    return;
                }
                else
                {
                    creep.memory.state = 'upgrading';
                    creep.memory.nextState = null;
                    creep.memory.targetId = null;

                }
                
                
                
                //by default, go upgrade the controller.
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
        }

    }
};
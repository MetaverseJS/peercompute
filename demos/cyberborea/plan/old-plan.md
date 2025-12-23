# cyberborea peercompute demo

## overview 
generate a standalone application that uses the peercompute library and three.js with cannon.js to create a seeded and repeatable procedurally generated hyperborea inspired by the hyperborea image in this folder. 

When peers open the application they should spawn somewhere in cyberborea. in proximity to other players but on the edge of the existing map. each player should procedurally generate the terrain in their vicinity as they explore. if another player is already in that area and has already generated that terrain they should fetch that terrain from the player there. 

## world description

terrain varies from flat planes, rolling hills, huge steep mountains, with lakes and rivers, ocean and boreal pine trees represented by green cones.  

the world should also contain stone temples and buildings grouped into towns of various size sparsely spread out around the world. 

some towns should be inhabited and some should be abandoned.  

inhabited towns should have fires at the tops of the temples and in fireplaces in the buildings. 

There should be a day night cycle that lasts about 6 minutes for a full day. and a summer winter cycle that lasts one hour for a full year. at the summer solstice there should be 5 minutes of daylight. at the winter solstice there should be 5 minutes of night.  The duration of a day and a year should be easily configurable somewhere for easy debugging.  each day/night should blend continuously into the next with the sun and moon acting similar to minecraft but also incorporating the winter/summer cycle. the moon should also show phases corresponding to progress of the current year, (Full moon for summer solstice, new moon for winter solstice and everything in between, emmitting an appropriate ammount of light for each phase)

in the spring the snow should melt revealing green tundra and flowers. growing thicker in the summer and then turning red and brown in the fall followed by being covered over with snow come winter. 

## Game mechanics. 

players should be represented by a very blocky simple character similar to minecraft. 

players should be equiped with a spear and a torch.

players should be able to use their spear to kill each other. when they die they should respawn with nothing somewhere else dropping their loot for the other player. 

there should be mammoths, wolves, moose, rabbits, and polar bears roaming the map. prey should be fearful and predators should be aggresive. mammoths should be neutral. mammoths and wolves should be in packs. animals should have HP that corresponds to their size.  predator/prey animals should be hostile to eachother.  female animals should rear children 

kill these animals to loot hide and meat and bones for tools. 

There should be a hunger and cold mechanics. different hides should provide different protection from the cold depending on how difficult it is to kill them. the torch should keep the player warm but should be very visible and bright. casting shadows and emmiting light that can be seen for a long distance. 

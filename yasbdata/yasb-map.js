var yasb = require('./cards-common.js');
card_data = yasb.basicCardData();
pilots = { };
card_data.pilotsById.forEach(
    (pilot) => {
        if (pilot.name && pilot.faction) {
            pilots[pilot.id] = { faction: pilot.faction.canonicalize(), xws: pilot.name.canonicalize() };
        }
    }
)
upgrades = { };
card_data.upgradesById.forEach(
    (upgrade) => {
        if (upgrade.name && upgrade.slot) {
            upgrades[upgrade.id] = { slot: upgrade.slot.canonicalize(), xws: upgrade.name.canonicalize() };
        } 
    }
)
yasb = { 
    pilots: pilots,
    upgrades: upgrades
}

const fs = require('fs');
fs.writeFile("yasb.json", JSON.stringify(yasb), 
    (err) => {
        if (err) {
            console.log("Error writing", err);
        } else {
            console.log("wrote yasb.json");
        }
    }
);
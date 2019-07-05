var https = require('https');
var fs = require('fs');
var jsonpack = require('jsonpack');
var JSZip = require('jszip');

const { Observable, from, zip } = require('rxjs');
const { concatMap } = require('rxjs/operators');

let baseUrl = "https://raw.githubusercontent.com/jychuah/xwing-data2/ffgscraper/";

let urls = [ ];
let data = { };
let shims = {
    xwsShip: {
        "mg100starfortress": "mg100starfortresssf17",
        "upsilonclassshuttle": "upsilonclasscommandshuttle",
        "tiesilencer": "tievnsilencer",
        "scavengedyt1300lightfreighter": "scavengedyt1300",
	"tieininterceptor": "tieinterceptor"
    },
    xwsPilot: {
        "niennumb-t70xwing": "niennunb",
        "niennunb-t70xwing" : "niennunb",
        "l337escapecraft" : "l337-escapecraft",
        "darthtyranus" : "countdooku"
    },
    xwsUpgrade: {
        "hansoloscum" : "hansolo-gunner",
        "rey" : "rey-gunner",
        "c3poresistance" : "c3po-crew" 
    }
}

function mangle_name(name) {
    // Canonicalizes names: T-65 X-Wing => t65xwing
    return name.replace(/\s/g, '').replace(/\-/g, '').toLowerCase();
}

function url_to_key_name(url) {
    // Extract file.json from end of URL and strip to friendly keyname
    let url_elements = url.split('/');
    let name = url_elements[url_elements.length - 1];
    return mangle_name(name).replace(/.json$/, '').replace(/.png$/, '').replace(/.jpg$/, '');
}

function replace_json_data(data, filename, json) {
    // Helper function to replace a ".json" filename in the data set
    // with the contents of the .json file as an object
    let jsonString = JSON.stringify(data);
    jsonString = jsonString.replace('"' + filename + '"', JSON.stringify(json));
    return JSON.parse(jsonString);
}

function extractFileList(tree) {
    // "Flatten" a JSON dictionary, keeping only string values with a file extension
    let unpack_queue = [ ];
    let download_list = [ ];
    if (tree) {
        // Push the manifest dictionary as the first object
        unpack_queue.push(tree);

        // While there are still items to unpack
        while (unpack_queue.length > 0) {
            // Dequeue the front item
            let item = unpack_queue.shift();

            try {
                // If the item is a string, see if it matches our extension
                if (typeof item == "string") {
                if (item.endsWith(".json")) {
                    download_list.push(item);
                }
                } else if (item instanceof Array) {
                // If it's an array, push all values to the back of the unpack queue
                item.forEach(
                    (element) => {
                    if (element == undefined) {
                        console.log("Empty array element in ", item);
                    } else {
                        unpack_queue.push(element);
                    }
                    }
                );
                } else {
                // If it's a dictionary, unpack all key/value pairs and only push the values
                Object.entries(item).forEach(
                    ([ key, value ]) => {
                    if (value == undefined) {
                        console.log("Empty value in ", item);
                    } else {
                        unpack_queue.push(value);
                    }
                    }
                )
                }
            } catch (err) {
                console.log("Error creating file list from manifest", manifest);
                console.log("Could not unpack", item);
            }
        }
    } 
    return download_list;
}

function get(url) {
    console.log("Retrieving " + url);
    return new Promise((resolve, reject) => {
        const request = https.get(url, (res) => {
            let data = "";
            if (res.status >= 400) {
                reject(res);
            } else {
                res.on('data', (chunk) => {
                    data += chunk.toString();
                });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            }
        });
        request.on('error', reject);
        request.end();
    });
}

function reshape_manifest(manifest) {
    // Reshapes a manifest file in preparation for downloads
    let new_manifest = JSON.parse(JSON.stringify(manifest));

    // Reshapes pilots from { faction, ships[] } to { faction: ships[] }
    new_manifest.pilots.forEach(
        (faction) => {
            let shipDictionary = { };
            if (Array.isArray(faction.ships)) {
                faction.ships.forEach(
                    (shipUrl) => {
                        shipDictionary[url_to_key_name(shipUrl)] = shipUrl;
                    }
                )
                faction.ships = shipDictionary;
            }
        }
    )

    // Reshapes upgrades from upgrade[] to upgrades: { type: upgrade[] }
    let upgradeDictionary = { };
    if (Array.isArray(new_manifest.upgrades)) { 
        new_manifest.upgrades.forEach(
            (upgradeUrl) => {
                upgradeDictionary[url_to_key_name(upgradeUrl)] = upgradeUrl;
            }
        )
        new_manifest.upgrades = upgradeDictionary;
    }
    return new_manifest;
}

function getYasbData() {
    let yasb = require('./cards-common.js');
    let card_data = yasb.basicCardData();
    let pilots = { };
    card_data.pilotsById.forEach(
        (pilot) => {
            if (pilot.name && pilot.faction) {
                let shipxws = card_data.ships[pilot.ship].xws.canonicalize();
                pilots[pilot.id] = { faction: pilot.faction.canonicalize(), xws: pilot.name.canonicalize(), ship: shipxws };
            }
        }
    )
    let upgrades = { };
    card_data.upgradesById.forEach(
        (upgrade) => {
            if (upgrade.name && upgrade.slot) {
                upgrades[upgrade.id] = { slot: upgrade.slot.canonicalize(), xws: upgrade.name.canonicalize() };
            } 
        }
    )
    return { 
        pilots: pilots,
        upgrades: upgrades
    }
}

function stripText(manifest) {
    manifest.pilots.forEach(
        (faction) => {
            Object.entries(faction.ships).forEach(
                ([ key, ship ]) => {
                    ship.pilots.forEach(
                        (pilot) => {
                            if (pilot.ability) {
                                pilot.ability = "";
                            }
                            if (pilot.shipAbility) {
                                pilot.shipAbility.text = "";
                            }
                            if (pilot.text) {
                                pilot.text = "";
                            }
                            if (pilot.artwork) {
                                pilot.artwork = "";
                            }
                            if (pilot.image) {
                                pilot.image = "";
                            }
                        }
                    )
                    if (ship.alt) {
                        delete ship.alt;
                    }
                }
            )
        }
    )
    Object.entries(manifest.upgrades).forEach(
        ([ upgradeType, upgradeArray ]) => {
            upgradeArray.forEach(
                (upgrade) => {
                    upgrade.sides.forEach(
                        (side) => {
                            if (side.ability) {
                                side.ability = "";
                            }
                            if (side.text) {
                                side.text = "";
                            }
                            if (side.alt) {
                                delete side.alt;
                            }
                            if (side.image) {
                                side.image = "";
                            }
                            if (side.artwork) {
                                side.artwork = "";
                            }
                        }
                    )
                }
            )
        }
    )
}


function injectConditionAssociatedFFG(data, xwsCondition, ffg) {
    let condition = data.conditions.find((condition) => condition.xws == xwsCondition);
    condition.ffg = ffg;
}

function searchConditions(data) {
    data.pilots.forEach(
        (faction) => {
            Object.entries(faction.ships).forEach(
                ([keyname, ship]) => {
                    ship['pilots'].forEach(
                        (pilot) => {
                            if (pilot.conditions) {
                                pilot.conditions.forEach(
                                    (condition) => {
                                        injectConditionAssociatedFFG(data, condition, pilot.ffg);
                                    }
                                )
                            }
                        }
                    )
                }
            )
        }
    );
    Object.entries(data.upgrades).forEach(
        ([upgradeType, upgrades ]) => {
            (upgrades).forEach(
                (upgrade) => {
                upgrade.sides.forEach(
                    (side) => {
                        if (side.conditions) {
                            side.conditions.forEach(
                                (condition) => {
                                    injectConditionAssociatedFFG(data, condition, side.ffg);
                                }
                            )
                        }
                    }
                )
                }
            )
        }
    );
}

get(baseUrl + "data/manifest.json").then(
    (manifest) => {
        manifest = reshape_manifest(manifest);
        files = extractFileList(manifest);

        // Create download list
        let urls = [ ];
        files.forEach(
            (file) => {
                urls.push(baseUrl + file);
            }
        )
        let url_obs = from(urls);
        let download_obs = from(urls).pipe(
            concatMap(
                (url) => get(url)
            )
        );
        let zipped = zip(url_obs, download_obs, (url, response) => ({ url, response }));
        
        zipped.subscribe(
            (result) => {
                let filename = result.url.replace(baseUrl, "");
                manifest = replace_json_data(manifest, filename, result.response);
            },
            (error) => {
                console.log("error", error);
            },
            () => {
                stripText(manifest);
                manifest.yasb = getYasbData();
                manifest.shims = shims;
                searchConditions(manifest);
                console.log("Writing to manifest.json");
                fs.writeFileSync("./manifest.json", JSON.stringify(manifest));
            }
        );
    }
)

const fs = require("fs");
const data = require("./mapdataMod.json");
var PNG = require('pngjs').PNG;

const mapSize = data.mapSize;
const sectorData = Object.values(data.sectors);
const laneData = Object.values(data.connections);

class Color {
    constructor(R, G, B, A) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
    }

    equals(o) {
        if(this.R === o.R &&
            this.G === o.G &&
            this.B === o.B &&
            this.A === o.A
        ) {
            return true
        }

        return false;
    }
}

function findClosestUnitLocation(sectorPos, sID) {
    sX = sectorPos.x;
    sY = sectorPos.y;

    const closest = {
        p: undefined,
        dist: mapSize * mapSize
    }

    unitIconLoc.forEach(e => {
        eX = e.x;
        eY = e.y;

        dist = Math.abs((sX-eX)*(sX-eX) + (sY-eY)*(sY-eY))

        if(dist < closest.dist) {
            closest.p = e;
            closest.dist = dist;
        }
    });

    console.log(`${sID} Closest: ${sX},${sY} | ${closest.p.x},${closest.p.y}`)
    return {x:closest.p.x, y:closest.p.y};
}

function updateSectors() {
    return sectorData.map((sector, i) => {
        return {
            name: sector.name,
            abbr: "[UNDEFINED]",
            position: {x:sector.position.x, y:sector.position.y},
            unitIconLocation: findClosestUnitLocation(sector.position, i)
        }
    });
}
function updateConnections() {
    const res = {}

    for (let i = 0; i < laneData.length; i++) {
        const e = laneData[i];
    
        if(e.connections.length != 0)
            res[e.sectorID] = e.connections;
    }

    return res;
}

const unitIconLoc = []
fs.createReadStream("./src/_data/unitLoc.png")
.pipe(new PNG())
.on('parsed', function() {

    var black = new Color(0,0,0,255);
    console.log("parsed")
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            var idx = (this.width * y+x) << 2;

            var RGBA = new Color(this.data[idx], this.data[idx+1], this.data[idx+2], this.data[idx+3]);
            if(RGBA.equals(black)) {
                unitIconLoc.push({x:x, y:y})
            }
        }         
    }
    console.log(unitIconLoc.length);

    unitIconLoc.forEach(e => {
        console.log(e);
    });

    const newOutput = {
        mapSize: mapSize,
        sectors: updateSectors(),
        connections: updateConnections(),
    }
    fs.writeFileSync("./src/_data/mapdataUpdated.json", JSON.stringify(newOutput));
})
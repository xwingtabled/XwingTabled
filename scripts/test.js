var zlib = require('zlib');
var fs = require('fs');

zlib.gunzip(fs.readFileSync('manifest.gz'), (error, buffer) => {
    if (error) { 
        console.log("Error unzipping", error);
    } else {
        console.log("Unzipped", buffer.length);
    }
});
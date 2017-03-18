const fs = require("fs");

db = JSON.parse(fs.readFileSync('db.json'))

function sortNumber(a,b) {
    return a - b;
}

function getNumberSequence(versions) {
    let cleanVersions = []
    versions.forEach((version) => {
        let trimmedVersion = version.trim();
        let intVersion = parseInt(trimmedVersion);
        cleanVersions.push(intVersion);
    })
    cleanVersions = cleanVersions.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
    })
    cleanVersions = cleanVersions.sort(sortNumber);
    //console.log(cleanVersions);
    let sequences = [];

    var i = 0;
    while (i < cleanVersions.length){
        var steps = 1
        var sequence = [cleanVersions[i]];
        while (cleanVersions[i+steps] == cleanVersions[i] + steps) {
            sequence.push(cleanVersions[i + steps]);
            steps++;
        }
        sequences.push(sequence);

        // console.log("cleanVersions before splice is: ", cleanVersions);
        cleanVersions.splice(i, steps);
        // console.log("cleanVersions after splice is: ", cleanVersions);
        i = 0
    }
    let final_sequences = [];

    // get only first and last element
    sequences.forEach((sequence) => {
        final_sequences.push([sequence[0], sequence[sequence.length-1]]);
    })

    // remove duplicates
    final_sequences.forEach((sequence, i) => {
        final_sequences[i] = sequence.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
    })
    for (var i = 0; i < final_sequences.length; i++) {
        final_sequences[i] = final_sequences[i].toString().replace(/[^a-zA-Z0-9]/g, '-');
    }
    //console.log("Final sequences is: ", final_sequences);
    return final_sequences;
}


Object.keys(db).forEach((keyword, idx) => {
    //console.log("for keyword: ", keyword)
    let browsers = db[keyword].unsupported_browsers.split('\n');

    browsers.forEach((browser, i) => {
        let browserVersions = browser.split(':')
        try {
            browserVersions[1] = browserVersions[1].split(",");
        } catch (err) {
            console.log("ERROR:", err);
        }
        if (browserVersions[1] instanceof Array) {
            if (browserVersions[1].length > 1) {
                browserVersions[1] = getNumberSequence(browserVersions[1]).join(',');
            } else {
                // just trim and update
                browserVersions[1] = browserVersions[1][0].trim();
            }
        }
        browsers[i] = browserVersions.join(': ');
    });

    db[keyword].unsupported_browsers = browsers;
})
console.log(db);
fs.writeFileSync('db_updated.json', JSON.stringify(db, null, 2));

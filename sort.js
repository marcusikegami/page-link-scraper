const fs = require('fs');

// Read the contents of the file
fs.readFile('links.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Split the data into lines
    const lines = data.split('\n');

    // Extract the destination links (after the '->')
    const links = lines.map(line => {
        const parts = line.split(' -> ');
        return parts[1] ? parts[1].trim() : null;
    }).filter(link => link); // Remove null or undefined links

    // Get unique links using a Set
    const uniqueLinks = Array.from(new Set(links));

    // Write the unique links to a new file
    fs.writeFile('unique_links.txt', uniqueLinks.join('\n'), 'utf8', err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Unique links have been written to unique_links.txt');
    });
});
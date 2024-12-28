const fs = require('fs');

// Read the contents of the file
fs.readFile('unique_links.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Split the data into lines
    const lines = data.split('\n');

    // Filter out links containing specific words
    const filteredLinks = lines.filter(link => {
        return !/wishlist|price|login|cart|bigcommerce/i.test(link);
    });

    // Sort the filtered links alphabetically
    const sortedLinks = filteredLinks.sort();

    // Write the sorted and filtered links to a new file
    fs.writeFile('filtered_links.txt', sortedLinks.join('\n'), 'utf8', err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Filtered and sorted links have been written to filtered_links.txt');
    });
});

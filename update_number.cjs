const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // For WhatsApp links (wa.me should not have the + sign)
    content = content.replace(/wa\.me\/0244240166/g, 'wa.me/233244240166');
    content = content.replace(/wa\.me\/\+233244240166/g, 'wa.me/233244240166');

    // For variable assignments (phone = '...')
    content = content.replace(/phone = '0244240166'/g, "phone = '233244240166'");
    
    // For tel: links
    content = content.replace(/tel:\+0244240166/g, 'tel:+233244240166');
    content = content.replace(/tel:0244240166/g, 'tel:+233244240166');

    // For UI Display
    content = content.replace(/'0244240166'/g, "'+233244240166'");
    content = content.replace(/"0244240166"/g, '"+233244240166"');
    content = content.replace(/>0244240166</g, '>+233244240166<');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});

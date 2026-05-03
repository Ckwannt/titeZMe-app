const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all tsx and ts files
const files = execSync('find app components lib -type f -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(f => f);

function collectionToSchema(coll) {
    if (coll === 'users') return 'user';
    if (coll === 'barberProfiles') return 'barber';
    if (coll === 'barbershops') return 'barbershop';
    if (coll === 'bookings') return 'booking';
    if (coll === 'services') return 'service';
    if (coll === 'schedules') return 'schedule';
    if (coll === 'invites') return 'invite';
    if (coll === 'reviews') return 'review';
    if (coll === 'notifications') return 'notification';
    return null;
}

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let schemasToImport = new Set();
    
    // Process addDoc(collection(db, 'collName'), data)
    // Becomes: addDoc(collection(db, 'collName'), collNameSchema.parse(data))
    const addDocRegex = /addDoc\(\s*collection\(\s*db\s*,\s*'([^']+)'\s*\)\s*,\s*(\{[\s\S]*?\})\s*\)/g;
    content = content.replace(addDocRegex, (match, collName, dataObj) => {
        const schemaName = collectionToSchema(collName) + 'Schema';
        if (!schemaName || schemaName === 'nullSchema') return match;
        schemasToImport.add(schemaName);
        return `addDoc(collection(db, '${collName}'), ${schemaName}.parse(${dataObj}))`;
    });

    // Process setDoc(doc(db, 'collName', id), data...
    const setDocRegex = /setDoc\(\s*(?:doc\(\s*db\s*,\s*'([^']+)'[^)]*\)|ref)[^,]*,([^)]+)\)/g;
    // We can't reliably replace arbitrarily since `data` could be complex. 
}

console.log("Not comprehensive enough, doing ast");

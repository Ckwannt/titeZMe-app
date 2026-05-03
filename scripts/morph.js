const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const collectionMap = {
    'users': 'user',
    'barberProfiles': 'barber',
    'barbershops': 'barbershop',
    'bookings': 'booking',
    'services': 'service',
    'schedules': 'schedule',
    'invites': 'invite',
    'reviews': 'review',
    'notifications': 'notification'
};

function getCollectionFromDocOrCollectionCall(callExpr) {
    if (!callExpr) return null;
    const args = callExpr.getArguments();
    if (args.length >= 2) {
        const nameArg = args[1];
        if (nameArg && nameArg.getKind() === SyntaxKind.StringLiteral) {
            return nameArg.getLiteralText();
        }
    }
    return null;
}

const sourceFiles = project.getSourceFiles();

for (const sourceFile of sourceFiles) {
    if (sourceFile.getFilePath().includes('schemas.ts')) continue;
    let schemasToImport = new Set();
    let hasChanges = false;

    // Convert to array to avoid iterator invalidation
    const callExprs = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    
    // We store replacements and process from bottom up
    const replacements = [];

    for (const callExpr of callExprs) {
        const expression = callExpr.getExpression();
        const text = expression.getText();
        
        if (text === 'addDoc' || text === 'setDoc' || text === 'updateDoc') {
            const args = callExpr.getArguments();
            if (args.length < 2) continue;

            const refArg = args[0];
            let dataArgIndex = 1;
            let collectionName = null;

            if (refArg.getKind() === SyntaxKind.CallExpression) {
                const refText = refArg.getExpression().getText();
                if (refText === 'collection' || refText === 'doc') {
                    collectionName = getCollectionFromDocOrCollectionCall(refArg);
                }
            } else if (refArg.getKind() === SyntaxKind.Identifier) {
                const symbol = refArg.getSymbol();
                if (symbol) {
                    const valueDec = symbol.getValueDeclaration();
                    if (valueDec && valueDec.getInitializer) {
                        const init = valueDec.getInitializer();
                        if (init && init.getKind() === SyntaxKind.CallExpression) {
                            collectionName = getCollectionFromDocOrCollectionCall(init);
                        }
                    }
                }
            }

            if (!collectionName && refArg.getKind() === SyntaxKind.CallExpression) {
                 const innerArgs = refArg.getArguments();
                 if (innerArgs.length >= 1 && innerArgs[0].getKind() === SyntaxKind.CallExpression) {
                     collectionName = getCollectionFromDocOrCollectionCall(innerArgs[0]);
                 }
            }

            if (collectionName && collectionMap[collectionName]) {
                 const schemaPrefix = collectionMap[collectionName];
                 let schemaName = text === 'updateDoc' ? `${schemaPrefix}UpdateSchema` : `${schemaPrefix}Schema`;
                 
                 if (text === 'setDoc' && args.length === 3) {
                     const optArg = args[2];
                     if (optArg.getText().includes('merge: true')) {
                         schemaName = `${schemaPrefix}UpdateSchema`;
                     }
                 }

                 const dataArg = args[dataArgIndex];
                 if (dataArg && !dataArg.getText().includes('.parse(')) {
                     replacements.push({
                         arg: dataArg,
                         newText: `${schemaName}.parse(${dataArg.getText()})`,
                         schema: schemaName
                     });
                 }
            }
        }
    }

    // Sort by position descending to avoid shifting offsets affecting subsequent replacements
    replacements.sort((a, b) => b.arg.getPos() - a.arg.getPos());

    for (const r of replacements) {
        r.arg.replaceWithText(r.newText);
        schemasToImport.add(r.schema);
        hasChanges = true;
    }

    if (hasChanges) {
        // check if import already exists
        const imports = sourceFile.getImportDeclarations();
        const existingSchemaImport = imports.find(i => i.getModuleSpecifierValue() === '@/lib/schemas');
        
        if (existingSchemaImport) {
             for (const s of schemasToImport) {
                 const hasNamed = existingSchemaImport.getNamedImports().find(ni => ni.getName() === s);
                 if (!hasNamed) {
                     existingSchemaImport.addNamedImport(s);
                 }
             }
        } else {
            sourceFile.addImportDeclaration({
                namedImports: Array.from(schemasToImport),
                moduleSpecifier: "@/lib/schemas"
            });
        }
        
        sourceFile.saveSync();
        console.log(`Updated ${sourceFile.getFilePath()}`);
    }
}

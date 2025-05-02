// const fs = require("fs");
// const path = require("path");
// const recast = require("recast");
// const babelParser = require("@babel/parser");
// const { getProjectPath } = require("./projectPathHelper");

// exports.updateRoutesFile = (pageName) => {
//   const projectPath = getProjectPath();
//   if (!projectPath) throw new Error("Projet non défini");

//   const routesFilePath = path.join(projectPath, "src", "routes.js");
//   const code = fs.readFileSync(routesFilePath, "utf-8");
//   console.log("Code à parser dans routes.js :\n", code); 
//   const ast = recast.parse(code, {
//     parser: {
//       parse(source) {
//         return babelParser.parse(source, {
//           sourceType: "module",
//           plugins: ["jsx", "typescript", "classProperties"]
//         });
//       }
//     }
//   });
//   const b = recast.types.builders;

//   const formattedPageName = pageName[0].toUpperCase() + pageName.slice(1);

//   // Création de l'import default
//   const importDeclaration = b.importDeclaration(
//     [b.importDefaultSpecifier(b.identifier(formattedPageName))],
//     b.stringLiteral(`./pages/${formattedPageName}`)
//   );
//   const hasImport = ast.program.body.some(
//     node => node.type === "ImportDeclaration" && node.source.value === `./pages/${formattedPageName}`
//   );
//   // Ajout de l'import après les 3 premiers imports (ou adapte selon ton code)
//   if (!hasImport) {
//     ast.program.body.splice(3, 0, importDeclaration);
//   }
//   // Insertion du nouveau <Route />
//   recast.types.visit(ast, {
//     visitJSXElement(pathNode) {
//       const opening = pathNode.node.openingElement;
//       if (opening.name.name === "Routes") {
//         const newRoute = b.jsxElement(
//           b.jsxOpeningElement(
//             b.jsxIdentifier("Route"),
//             [
//               b.jsxAttribute(
//                 b.jsxIdentifier("path"),
//                 b.stringLiteral(`/${formattedPageName.toLowerCase()}`)
//               ),
//               b.jsxAttribute(
//                 b.jsxIdentifier("element"),
//                 b.jsxExpressionContainer(
//                   b.jsxElement(
//                     b.jsxOpeningElement(
//                       b.jsxIdentifier(formattedPageName),
//                       [],
//                       true
//                     ),
//                     null,
//                     [],
//                     true
//                   )
//                 )
//               )
//             ],
//             true
//           ),
//           null,
//           [],
//           true
//         );
//         // Ajout propre dans <Routes> avec retour à la ligne
//         pathNode.node.children.push(b.jsxText("\n      "), newRoute, b.jsxText("\n    "));
//         return false;
//       }
//       this.traverse(pathNode);
//     }
//   });
//   const updatedCode = recast.print(ast).code;
//   fs.writeFileSync(routesFilePath, updatedCode, "utf-8");
// };
const fs = require("fs");
const path = require("path");
const recast = require("recast");
const parser = require("recast/parsers/babel");
const { getProjectPath } = require("./projectPathHelper");

exports.updateRoutesFile = (pageName) => {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Projet non défini");

  const routesFilePath = path.join(projectPath, "src", "routes.js");
  const code = fs.readFileSync(routesFilePath, "utf-8");

  const ast = recast.parse(code, { parser });
  const b = recast.types.builders;
  const formattedPageName = pageName[0].toUpperCase() + pageName.slice(1);
  const routePath = `/${formattedPageName.toLowerCase()}`;

  // Vérifie si l'import existe déjà
  const hasImport = ast.program.body.some(
    (node) =>
      node.type === "ImportDeclaration" &&
      node.source.value === `./pages/${formattedPageName}`
  );

  if (!hasImport) {
    const importDeclaration = b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier(formattedPageName))],
      b.literal(`./pages/${formattedPageName}`)
    );

    // Ajoute après le dernier import
    const lastImportIndex = ast.program.body.reduce((lastIndex, node, index) => {
      return node.type === "ImportDeclaration" ? index : lastIndex;
    }, -1);
    ast.program.body.splice(lastImportIndex + 1, 0, importDeclaration);
  }

  // Ajout de la nouvelle <Route />
  recast.types.visit(ast, {
    visitJSXElement(pathNode) {
      const opening = pathNode.node.openingElement;
      if (opening.name.name === "Routes") {
        const children = pathNode.node.children;

        // Évite les doublons de route
        const routeExists = children.some((child) => {
          return (
            child.type === "JSXElement" &&
            child.openingElement.name.name === "Route" &&
            child.openingElement.attributes.some(
              (attr) =>
                attr.name.name === "path" &&
                attr.value.value === routePath
            )
          );
        });

        if (!routeExists) {
          const newRoute = b.jsxElement(
            b.jsxOpeningElement(
              b.jsxIdentifier("Route"),
              [
                b.jsxAttribute(b.jsxIdentifier("path"), b.literal(routePath)),
                b.jsxAttribute(
                  b.jsxIdentifier("element"),
                  b.jsxExpressionContainer(
                    b.jsxElement(
                      b.jsxOpeningElement(
                        b.jsxIdentifier(formattedPageName),
                        [],
                        true
                      ),
                      null,
                      [],
                      true
                    )
                  )
                )
              ],
              true
            ),
            null,
            [],
            true
          );

          children.push(b.jsxText("\n      "), newRoute, b.jsxText("\n    "));
        }

        return false;
      }
      this.traverse(pathNode);
    }
  });

  const output = recast.print(ast).code;
  fs.writeFileSync(routesFilePath, output, "utf-8");
  console.log(`✅ Route ajoutée (ou déjà existante) pour : ${formattedPageName}`);
};



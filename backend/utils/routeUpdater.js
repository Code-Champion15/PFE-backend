const fs = require("fs");
const path = require("path");
const recast = require("recast");
const parser = require("recast/parsers/babel");
const { getProjectPath } = require("./projectPathHelper");

exports.updateRoutesFile = async (pageName, userId) => {

  const projectPath = await getProjectPath(userId);

  const routesFilePath = path.join(projectPath, "src", "routes.js");
  const code = fs.readFileSync(routesFilePath, "utf-8");

  const ast = recast.parse(code, { parser });
  const b = recast.types.builders;
  const formattedPageName = pageName[0].toUpperCase() + pageName.slice(1);
  const routePath = `/${formattedPageName.toLowerCase()}`;

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

    const lastImportIndex = ast.program.body.reduce((lastIndex, node, index) => {
      return node.type === "ImportDeclaration" ? index : lastIndex;
    }, -1);
    ast.program.body.splice(lastImportIndex + 1, 0, importDeclaration);
  }

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



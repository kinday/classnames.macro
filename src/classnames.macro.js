import { createMacro, MacroError } from "babel-plugin-macros"

function groupBy(fn, xs) {
  const result = {}
  for (const x of xs) {
    const key = fn(x)
    result[key] = result[key] ?? []
    result[key].push(x)
  }
  return result
}

export default createMacro(({ babel, references: { default: paths } }) => {
  let firstClassName = true

  function getPrefix() {
    const prefix = firstClassName ? "" : " "
    firstClassName = false
    return prefix
  }

  function unpackArray(arrayExpression) {
    const elements = arrayExpression.elements.reduce((result, node) => {
      if (babel.types.isArrayExpression(node)) {
        return result.concat(unpackArray(node).elements)
      }

      if (babel.types.isObjectExpression(node)) {
        return result.concat(unpackObject(node).elements)
      }

      return result.concat([node])
    }, [])

    return babel.types.arrayExpression(elements)
  }

  function unpackObjectProperty(objectProperty) {
    const shouldStringify = objectProperty.computed
      ? babel.types.isStringLiteral(objectProperty.key)
      : babel.types.isIdentifier(objectProperty.key)

    const right = shouldStringify
      ? babel.types.stringLiteral(
          objectProperty.computed
            ? objectProperty.key.value
            : objectProperty.key.name
        )
      : objectProperty.key

    return babel.types.logicalExpression("&&", objectProperty.value, right)
  }

  function unpackObject(objectExpression) {
    const elements = objectExpression.properties.map(unpackObjectProperty)

    return babel.types.arrayExpression(elements)
  }

  function unpackConditionalExpression(node) {
    return babel.types.conditionalExpression(
      node.test,
      maybeGetValue(node.consequent),
      maybeGetValue(node.alternate)
    )
  }

  function unpackLogicalExpression(node) {
    if (node.operator === "??") {
      return babel.types.logicalExpression(
        "??",
        node.left,
        maybeGetValue(node.right)
      )
    }

    return babel.types.conditionalExpression(
      node.left,
      node.operator === "&&"
        ? maybeGetValue(node.right)
        : babel.types.stringLiteral(""),
      node.operator === "||"
        ? maybeGetValue(node.right)
        : babel.types.stringLiteral("")
    )
  }

  function maybeUnpackNode(node) {
    if (babel.types.isArrayExpression(node)) {
      return unpackArray(node)
    }

    if (babel.types.isObjectExpression(node)) {
      return unpackObject(node)
    }

    if (babel.types.isConditionalExpression(node)) {
      return unpackConditionalExpression(node)
    }

    if (babel.types.isLogicalExpression(node)) {
      return unpackLogicalExpression(node)
    }

    if (babel.types.isNullLiteral(node)) {
      return babel.types.stringLiteral("")
    }

    if (
      babel.types.isMemberExpression(node) ||
      babel.types.isIdentifier(node)
    ) {
      return babel.types.conditionalExpression(
        node,
        babel.types.binaryExpression("+", babel.types.stringLiteral(" "), node),
        babel.types.stringLiteral("")
      )
    }

    if (babel.types.isTemplateLiteral(node)) {
      return babel.types.binaryExpression("+", babel.types.stringLiteral(getPrefix()), node);
    }

    // TODO: This probably does not belong here
    if (babel.types.isStringLiteral(node)) {
      if (node.value.indexOf(" ") !== 0) {
        return babel.types.stringLiteral(getPrefix() + node.value)
      }
    }

    return node
  }

  function concatStringNodes(nodes) {
    if (nodes == null) {
      return babel.types.stringLiteral("")
    }

    return babel.types.stringLiteral(nodes.map((node) => node.value).join(" "))
  }

  function maybeGetValue(node) {
    const maybeNodes = maybeUnpackNode(node)
    return babel.types.isArrayExpression(maybeNodes)
      ? getValue(maybeNodes)
      : maybeNodes
  }

  function concatNodes(nodes) {
    const [maybeLeftNode, ...rightNodes] = nodes

    const leftNode = maybeGetValue(maybeLeftNode)

    if (!rightNodes.length) {
      return leftNode
    }

    return babel.types.binaryExpression("+", leftNode, concatNodes(rightNodes))
  }

  function getValue(input) {
    const { elements } = unpackArray(input)
    const filteredElements = elements.filter(
      (element) =>
        !babel.types.isNullLiteral(element) &&
        !(babel.types.isIdentifier(element) && element.name === "undefined") &&
        !(babel.types.isBooleanLiteral(element) && element.value === false)
    )

    const values = groupBy((node) => {
      if (babel.types.isStringLiteral(node)) {
        return "static"
      }

      return "dynamic"
    }, filteredElements)

    return concatNodes([
      concatStringNodes(values.static),
      ...(values.dynamic ?? []),
    ])
  }

  // Return input data if macro was called correctly
  function getInput(path) {
    if (path.type === "CallExpression") {
      return babel.types.arrayExpression(path.node.arguments)
    }

    return null
  }

  paths.forEach(({ parentPath }) => {
    const input = getInput(parentPath)

    if (input) {
      const value = getValue(input)

      if (value) {
        parentPath.replaceWith(value)
      } else {
        const { line } = parentPath.node.loc.start
        throw new MacroError(
          `Invalid input given to classnames.macro at line ${line}`
        )
      }
    }
  })
})

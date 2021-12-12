import { createMacro, MacroError } from "babel-plugin-macros"

export default createMacro(({ references: { default: paths } }) => {
  paths.forEach(() => {
    throw new MacroError("Not implemented")
  })
})

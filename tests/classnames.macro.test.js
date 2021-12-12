import test from "ava"
import macroPlugin from "babel-plugin-macros"
import { transform } from "@babel/core"
import { stripIndent } from "common-tags"

function run(code) {
  return transform(code, {
    babelrc: false,
    plugins: [macroPlugin],
    filename: __filename,
  }).code.trim()
}

test("fails", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    classNames();
  `

  function fn() {
    run(input)
  }

  t.throws(fn)
})

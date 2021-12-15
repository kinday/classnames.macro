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

test("strings", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames("px-1", "py-2");
  `

  const expected = stripIndent`
    const CLASS_NAMES = "px-1 py-2";
  `

  const output = run(input)
  t.is(output, expected)
})

test("arrays", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(["px-1", ["py-2"]]);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "px-1 py-2";
  `

  const output = run(input)
  t.is(output, expected)
})

test("conditions", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames([
      "block",
      props.isPadded || "px-1",
      props.isPadded && "py-2",
      props.bgColor ?? "bg-gray-500"
    ]);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "block" + ((props.isPadded ? "" : " px-1") + ((props.isPadded ? " py-2" : "") + (props.bgColor ?? " bg-gray-500")));
  `

  const output = run(input)
  t.is(output, expected)
})

test("objects", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames([
      "px-1",
      { block: props.isBlock, "py-2": props.isPadded },
    ]);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "px-1" + ((props.isBlock ? " block" : "") + (props.isPadded ? " py-2" : ""));
  `

  const output = run(input)
  t.is(output, expected)
})

test("variables", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(["px-1", props.className]);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "px-1" + (" " + props.className);
  `

  const output = run(input)
  t.is(output, expected)
})

test("mixed", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(
      props.foo && ["foo", "fighters"],
      "bar",
      ["qux", { "baz": props.baz }, props.className]
    );
  `

  const expected = stripIndent`
    const CLASS_NAMES = "bar qux" + ((props.foo ? " foo fighters" : "") + ((props.baz ? " baz" : "") + (" " + props.className)));
  `

  const output = run(input)
  t.is(output, expected)
})

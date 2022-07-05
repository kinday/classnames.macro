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

test("variable", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const something = false;
    const CLASS_NAMES = classNames(something, "py-2");
  `

  const expected = stripIndent`
    const something = false;
    const CLASS_NAMES = "py-2" + (something ? " " + something : "");
  `

  const output = run(input)
  t.is(output, expected)
})

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

test("strings (template string)", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames("px-1", \`py-\${spaceY}\`);
  `

  const expected = 'const CLASS_NAMES = "px-1" + (" " + `py-${spaceY}`);'

  const output = run(input)
  t.is(output, expected)
})

test("null", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(null);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "";
  `

  const output = run(input)
  t.is(output, expected)
})

test("undefined", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(undefined);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "";
  `

  const output = run(input)
  t.is(output, expected)
})

test("false", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames(false);
  `

  const expected = stripIndent`
    const CLASS_NAMES = "";
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

test("computed properties (identifier)", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames({
      [bar]: props.bar,
    });
  `

  const expected = stripIndent`
    const CLASS_NAMES = "" + (props.bar ? bar ? " " + bar : "" : "");
  `

  const output = run(input)
  t.is(output, expected)
})

test("computed properties (template string)", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames('baz', {
      [\`bar--\${bar}\`]: props.bar,
    });
  `

  const expected = 'const CLASS_NAMES = "baz" + (props.bar ? " " + `bar--${bar}` : "");';

  const output = run(input)
  t.is(output, expected)
})

test("computed properties (member expression)", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames({
      [styles.baz]: props.baz
    });
  `

  const expected = stripIndent`
    const CLASS_NAMES = "" + (props.baz ? styles.baz ? " " + styles.baz : "" : "");
  `

  const output = run(input)
  t.is(output, expected)
})

test("computed properties (string)", (t) => {
  const input = stripIndent`
    import classNames from '../src/classnames.macro';
    const CLASS_NAMES = classNames({
      ["foo"]: props.foo,
    });
  `

  const expected = stripIndent`
    const CLASS_NAMES = "" + (props.foo ? " foo" : "");
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
    const CLASS_NAMES = "px-1" + (props.className ? " " + props.className : "");
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
      undefined,
      ["qux", { "baz": props.baz }, props.className],
      null,
      false
    );
  `

  const expected = stripIndent`
    const CLASS_NAMES = "bar qux" + ((props.foo ? " foo fighters" : "") + ((props.baz ? " baz" : "") + (props.className ? " " + props.className : "")));
  `

  const output = run(input)
  t.is(output, expected)
})

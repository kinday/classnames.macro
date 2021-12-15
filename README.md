# classnames.macro

Conditionally join CSS class names at build time in Babel.

## Preamble

The main goal of this package is to provide convenient API for CSS class names manipulation with the smallest performance hit.

**Use with caution.** The package is aiming to implement as many of [`classnames`][classnames] features as it is possible for a macro. `classnames.macro` is actively used as it is being developed but is not guaranteed to be problem-free.

## Usage

[Install and configure `babel-plugin-macros`][babel-plugin-macros] if you haven’t yet. Then use `classnames.macro`
[almost](https://github.com/kinday/classnames.macro/milestone/1) the same way you use [`classnames`][classnames].

## Example

Given the following input:

```js
import classNames from "classnames.macro"

function getClassName(options) {
  return classNames("block", options.dark && ["bg-black", "text-white"], {
    "font-bold": options.variant === "head",
    "text-sm": options.variant === "footnote",
  })
}
```

Babel will produce the following output:

```js
function getClassName(options) {
  return (
    "block" +
    ((options.dark ? " bg-black text-white" : "") +
      ((options.variant === "head" ? " font-bold" : "") +
        (options.variant === "footnote" ? " text-sm" : "")))
  )
}
```

## License

**MIT**

[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[classnames]: https://github.com/JedWatson/classnames

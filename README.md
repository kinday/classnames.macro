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

## Performance

`classnames.macro` outperforms (20 to 100 times faster) packages with similar API:

| Package            | Results                   | Notes                  |
| ------------------ | ------------------------- | ---------------------- |
| `classcat`         | 5 336 322 ops/s, ±0.37%   | 95.06% slower          |
| `classnames`       | 1 962 814 ops/s, ±0.17%   | slowest, 98.18% slower |
| `classnames.macro` | 107 975 749 ops/s, ±0.27% | **fastest**            |
| `clsx`             | 4 886 815 ops/s, ±0.27%   | 95.47% slower          |
| `html-classes`     | 4 410 463 ops/s, ±0.17%   | 95.92% slower          |

Benchmark source can be found in `benchmark.js`. To run the benchmark, clone the repo, install dependencies, build the package (`yarn build`) and run benchmark (`yarn benchmark`).

## License

**MIT**

[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[classnames]: https://github.com/JedWatson/classnames

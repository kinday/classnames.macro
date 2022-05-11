const Benny = require("benny")

function exampleOutput(name, output) {
  console.log(`"${name}"`)
  console.log(`\t${output}`)
}

// Mock variable for further value resolution
const props = {
  borderCollapse: false,
  className: "external-classname-one external-classname-two",
  editable: false,
  format: "finance",
  head: true,
  selected: true,
  scheduled: false,
  wrap: false,
}

Benny.suite(
  "CSS classname concatenation",

  Benny.add("classcat", () => {
    const classNames = require("classcat")

    function fn() {
      return classNames([
        "flex",
        "items-center",
        props.editable ? "p-1" : ["py-2", "px-3"],
        "border-gray-200",
        props.selected ? ["bg-blue-50", "text-blue-900"] : [],
        props.scheduled ? ["bg-gray-50", "text-gray-700", "italic"] : [],
        {
          "border-b": !props.borderCollapse,
          "tabular-nums": props.format === "finance" || props.format === "date",
          "font-bold": props.head,
          "justify-end": props.format === "finance",
          "text-right": props.format === "finance",
          "whitespace-nowrap": !props.wrap,
        },
        props.className,
      ])
    }

    if (process.env.BENCHMARK_DEBUG) {
      exampleOutput("classcat", fn())
    }

    return fn
  }),

  Benny.add("classnames", () => {
    const classNames = require("classnames")

    function fn() {
      return classNames([
        "flex",
        "items-center",
        props.editable ? "p-1" : ["py-2", "px-3"],
        "border-gray-200",
        props.selected ? ["bg-blue-50", "text-blue-900"] : [],
        props.scheduled ? ["bg-gray-50", "text-gray-700", "italic"] : [],
        {
          "border-b": !props.borderCollapse,
          "tabular-nums": props.format === "finance" || props.format === "date",
          "font-bold": props.head,
          "justify-end": props.format === "finance",
          "text-right": props.format === "finance",
          "whitespace-nowrap": !props.wrap,
        },
        props.className,
      ])
    }

    if (process.env.BENCHMARK_DEBUG) {
      exampleOutput("classnames", fn())
    }

    return fn
  }),

  Benny.add("classnames.macro", () => {
    const classNames = require("./lib/classnames.macro")

    function fn() {
      return classNames([
        "flex",
        "items-center",
        props.editable ? "p-1" : ["py-2", "px-3"],
        "border-gray-200",
        props.selected ? ["bg-blue-50", "text-blue-900"] : [],
        props.scheduled ? ["bg-gray-50", "text-gray-700", "italic"] : [],
        {
          "border-b": !props.borderCollapse,
          "tabular-nums": props.format === "finance" || props.format === "date",
          "font-bold": props.head,
          "justify-end": props.format === "finance",
          "text-right": props.format === "finance",
          "whitespace-nowrap": !props.wrap,
        },
        props.className,
      ])
    }

    if (process.env.BENCHMARK_DEBUG) {
      exampleOutput("classnames.macro", fn())
    }

    return fn
  }),

  Benny.add("clsx", () => {
    const classNames = require("clsx")

    function fn() {
      return classNames([
        "flex",
        "items-center",
        props.editable ? "p-1" : ["py-2", "px-3"],
        "border-gray-200",
        props.selected ? ["bg-blue-50", "text-blue-900"] : [],
        props.scheduled ? ["bg-gray-50", "text-gray-700", "italic"] : [],
        {
          "border-b": !props.borderCollapse,
          "tabular-nums": props.format === "finance" || props.format === "date",
          "font-bold": props.head,
          "justify-end": props.format === "finance",
          "text-right": props.format === "finance",
          "whitespace-nowrap": !props.wrap,
        },
        props.className,
      ])
    }

    if (process.env.BENCHMARK_DEBUG) {
      exampleOutput("clsx", fn())
    }

    return fn
  }),

  Benny.add("html-classes", () => {
    const classNames = require("html-classes")

    function fn() {
      return classNames([
        "flex",
        "items-center",
        props.editable ? "p-1" : ["py-2", "px-3"],
        "border-gray-200",
        props.selected ? ["bg-blue-50", "text-blue-900"] : [],
        props.scheduled ? ["bg-gray-50", "text-gray-700", "italic"] : [],
        {
          "border-b": !props.borderCollapse,
          "tabular-nums": props.format === "finance" || props.format === "date",
          "font-bold": props.head,
          "justify-end": props.format === "finance",
          "text-right": props.format === "finance",
          "whitespace-nowrap": !props.wrap,
        },
        props.className,
      ])
    }

    if (process.env.BENCHMARK_DEBUG) {
      exampleOutput("html-classes", fn())
    }

    return fn
  }),

  Benny.cycle(),
  Benny.complete()
)

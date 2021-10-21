# typed-less-modules-ts

> 这是一个从type-less-modules fork 的 

Generate TypeScript definitions (`.d.ts`) files for CSS Modules that are written in LESS (`.less`).

为LESS文件辅助创建`.d.ts`文件，以便typescript做更精确的类型检查。

Check out [this post to learn more](https://skovy.dev/generating-typescript-definitions-for-css-modules-using-less/) about the rationale and inspiration behind this package.

For example, given the following LESS:

```less
@import (reference) "./variables.less";

.text {
  color: @blue;

  &-highlighted {
    color: @yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

## Basic Usage

Run with npm package runner:

```bash
npx tlm src
```

Or, install globally:

```bash
yarn global add typed-less-modules
tlm src
```

Or, install and run as a `devDependency`:

```bash
yarn add -D typed-less-modules
yarn tlm src
```

## Advanced Usage

For all possible commands, run `tlm --help`.

The only required argument is the directoy where all LESS files are located. Running `tlm src` will search for all files matching `src/**/*.less`. This can be overridden by providing a [glob](https://github.com/isaacs/node-glob#glob-primer) pattern instead of a directory. For example, `tlm src/*.less`

### `--watch` (`-w`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch`

Watch for files that get added or are changed and generate the corresponding type definitions.

追踪文件变更，实时生成类型文件

### `--ignoreInitial`

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch --ignoreInitial`

Skips the initial build when passing the watch flag. Use this when running concurrently with another watch, but the initial build should happen first. You would run without watch first, then start off the concurrent runs after.

当使用`watch`时，不会对已有文件进行构建，只有当这些文件发生变更时才执行构建。

### `--includePaths` (`-i`)

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `tlm src --includePaths src/core`

An array of paths to look in to attempt to resolve your `@import` declarations. This example will search the `src/core` directory when resolving imports.

当使用`@import`时引入其他文件时，这些路径将会被列入搜索范围。

### `--nameFormat` (`-n`)

- **Type**: `"camel" | "kebab" | "param" | "dashes" | "none"`
- **Default**: `"camel"`
- **Example**: `tlm src --nameFormat camel`

The class naming format to use when converting the classes to type definitions.

定义类型时，使用的命名规范

- **camel**: 驼峰式，convert all class names to camel-case, e.g. `App-Logo` => `appLogo`.
- **kebab**/**param**: 串式 convert all class names to kebab/param case, e.g. `App-Logo` => `app-logo` (all lower case with '-' separators).
- **dashes**: 仅对包含`-`的类名进行`camel`转换，only convert class names containing dashes to camel-case, leave others alone, e.g. `App` => `App`, `App-Logo` => `appLogo`. Matches the webpack [css-loader camelCase 'dashesOnly'](https://github.com/webpack-contrib/css-loader#camelcase) option.
- **none**: 保持原始风格 do not modify the given class names (you should use `--exportType default` when using `--nameFormat none` as any classes with a `-` in them are invalid as normal variable names).
  Note: If you are using create-react-app v2.x and have NOT ejected, `--nameFormat none --exportType default` matches the class names that are generated in CRA's webpack's config.

### `--listDifferent` (`-l`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --listDifferent`

List any type definition files that are different than those that would be generated. If any are different, exit with a status code `1`.

### `--exportType` (`-e`)

- **Type**: `"named" | "default"`
- **Default**: `"named"`
- **Example**: `tlm src --exportType default`

The export type to use when generating type definitions.

导出类型的风格。

#### `named`

Given the following LESS:

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

#### `default`

Given the following LESS:

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export interface Styles {
  text: string;
  textHighlighted: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
```

This export type is useful when using kebab (param) cased class names since variables with a `-` are not valid variables and will produce invalid types or when a class name is a TypeScript keyword (eg: `while` or `delete`). Additionally, the `Styles` and `ClassNames` types are exported which can be useful for properly typing variables, functions, etc. when working with dynamic class names.

### `--interfaceNoQuotation` (`-q`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --interfaceNoQuotation`

在类名符合标准变量名定义的情况下，不再使用引号包裹类名。

### `--interfaceSplit` (`-s`)

- **Type**: `";" | "," | ""`
- **Default**: `,`
- **Example**: `tlm src --interfaceSplit`

在使用`default`类型导出类名时，使用那种模式分割类名。

## Examples

For examples, see the `examples` directory:

- [Basic Example](/examples/basic)
- [Default Export Example](/examples/default-export)

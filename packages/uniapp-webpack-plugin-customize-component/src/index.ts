type UsingComponents = Record<string, string>;

export type Options = Record<string, UsingComponents>;

export default class UniappCustomComponent {
  private options = {};
  constructor(options) {
    this.options = Object.keys(options).reduce((prev, item) => {
      return {
        ...prev,
        [`${item}.json`]: options[item],
      };
    }, {});
  }

  apply(compiler) {
    const _this = this;
    compiler.hooks.emit.tapAsync(
      "UniappCustomComponent",
      (compilation, callback) => {
        Object.keys(compilation.assets).forEach((name) => {
          if (Object.keys(_this.options).includes(name)) {
            const usingComponentsOption = _this.options[name];
            const appJson = JSON.parse(compilation.assets[name].source());
            appJson.usingComponents = {
              ...(appJson.usingComponents || {}),
              ...usingComponentsOption,
            };
            compilation.assets[name] = {
              source() {
                return JSON.stringify(appJson);
              },
              size() {
                return this.source().length;
              },
            };
          }
        });
        callback();
      }
    );
  }
}

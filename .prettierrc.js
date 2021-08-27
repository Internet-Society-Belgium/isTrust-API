module.exports = {
  singleQuote: true,
  semi: false,
  vueIndentScriptAndStyle: true,
  importOrder: [
    '^[^\\.](.*)$',
    '^[\\.\\/]*\\/types\\/(.*)$',
    '^[\\.\\/]*\\/middlewares\\/(.*)$',
    '^[\\.\\/]*\\/routes\\/(.*)$',
    '^[\\.\\/]',
  ],
  importOrderSeparation: true,
}

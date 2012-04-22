var Callbacks = {
  methods: {},

  add: function(name, fct) {
    this.methods[name] = fct
  },

  run: function(name, values) {
    this.methods[name](values);
    $(".lookup").lookup()
  }
}

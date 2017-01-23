riot.tag2('es6', '<p>{message},{name}</p>', '', '', function(opts) {
    const greeting = 'Hello'
    this.message = greeting
    this.name = () => {
      return 'Mr. Test'
    }
});

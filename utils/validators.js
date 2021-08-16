module.exports = {
  isNonEmptyString(inputString) {
    return (
      inputString &&
      typeof inputString === "string" &&
      inputString.trim().length > 0
    );
  },
  isValidEmail(email) {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return typeof email === "string" && email.match(mailformat);
  },
  isLettersOnly(name) {
    // non-empty
    // start with letter
    // contain letter, space, . , '
    return (
      this.isNonEmptyString(name) &&
      /^[A-Za-z .']+$/i.test(name) &&
      /^[A-Za-z]/i.test(name)
    );
  },

  isPositiveNumber(num) {
    return this.isNumeric(num) && num >= 0;
  },

  isNumeric(input) {
    if (typeof input == "number") return true;
    if (typeof input == "string") {
      return (
        !isNaN(input) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(input))
      ); // ...and ensure strings of whitespace fail
    }
  },
};

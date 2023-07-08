function BrowserslistError(message) {
  this.name = 'BrowserslistError'
  this.message = message
  this.browserslist = true
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, BrowserslistError)
  }
}

BrowserslistError.prototype = Error.prototype

module.exports = BrowserslistError
r.message = err.message.replace(STRIP_FILENAME_RE, "");
    err.hideStack = true;
  }
  return err;
};
class LoaderError extends Error {
  constructor(err) {
    super();
    const {
      name,
      message,
      codeFrame,
      hideStack
    } = format(err);
    this.name = "BabelLoaderError";
    this.message = `${name ? `${name}: ` : ""}${message}\n\n${codeFrame}\n`;
    this.hideStack = hideStack;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = LoaderError;
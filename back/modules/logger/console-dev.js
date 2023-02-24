class Logger {
  constructor(message, entete = '', context) {
    this.context = context
    this.message = message
    this.entete = entete
  }

  setEnteteColor(entete) {
    switch (entete.split(/[-:_\s]/)[0]) {
      case 'REQUETE':
        //blue
        return `\x1b[34m${entete}\x1b[0m`
      case 'RESPONSE':
        //Cyan
        return `\x1b[36m${entete}\x1b[0m`
      case 'TITRE':
        //White
        return `\x1b[37m${entete}\x1b[0m`
      case 'CONTENU':
        //White
        return `\x1b[37m${entete}\x1b[0m`
      case 'AUTH':
        //Yellow
        return `\x1b[33m${entete}\x1b[0m`
      case 'SOCKET':
        //Magenta
        return `\x1b[32m${entete}\x1b[0m`
      case 'DATABASE':
        //Magenta
        return `\x1b[30m${entete}\x1b[0m`
      default:
        return entete
    }
  }
  setTypeColor(type) {
    switch (type) {
      case 'info':
        return '\x1b[42m[INFO]\x1b[0m'
      case 'error':
        return '\x1b[41m[ERROR]\x1b[0m'
      case 'warn':
        return '\x1b[43m[WARN]\x1b[0m'
      case 'debug':
        return '\x1b[47m[DEBUG]\x1b[0m'
      default:
        return type.toUpperCase()
    }
  }
  createContextString(fakeError, stackStep = 1) {
    const errorStackArray = fakeError.stack.split('\n')

    if (errorStackArray.length > 1) {
      const origin = errorStackArray[stackStep]
      const folderAndLineArray = origin.split('\\').slice(-2)
      const folder = folderAndLineArray[0]
      let fileAndLine = folderAndLineArray[1].replace(')', '')
      return `${folder}/${fileAndLine}`
    } else {
      /**
       * @todo trace new Error object to display `${folder}/${fileAndLine}`
       */
      console.log(new Error(fakeError))
      return `Unknown error format: ${fakeError}`
    }
  }
  log(message, entete, context, type) {
    if (context instanceof Error) context = this.createContextString(context)
    if (!context) context = this.createContextString(new Error(), 3)
    if (type) type = this.setTypeColor(type)
    console.log(
      type,
      this.setEnteteColor(entete),
      `\x1b[35m${context}\x1b[0m`,
      message
    )
  }
  /**
   * @type {Method} info
   */
  info(message, entete = '', context = this.context) {
    this.log(message, entete, context, 'info')
  }
  error(message, entete = '', context = this.context) {
    this.log(message, entete, context, 'error')
  }
  warn(message, entete = '', context = this.context) {
    this.log(message, entete, context, 'warn')
  }
  debug(message, entete = '', context = this.context) {
    this.log(message, entete, context, 'debug')
  }
}

exports.LoggerClass = Logger

/**
 * @class
 * @name Logger
 * @classdesc Display fancy log in terminal with custom console.log() arguments.
 * @example
 * logger.warn('this have to be log has warn', 'SOCKET')
 * // will display in terminal with fancy colors:
 * '[WARN] SOCKET folderName/fileName:line:column this have to be log has warn'
 * logger.error('causes of error', 'SOCKET', '<Error instance>')
 * // will display in terminal  with fancy colors, where folderName, fileName, line and column are extract of the Error instance stack:
 * '[ERROR] SOCKET folderName/fileName:line:column causes of error'
 *
 * @method {@link Logger.info}
 * @method {@link Logger.warn}
 * @method {@link Logger.error}
 * @method {@link Logger.debug}
 */
module.exports = new Logger()

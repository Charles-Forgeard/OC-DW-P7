class ConsoleDev {
  constructor(message, entete = '', context){
    this.context = context;
    this.message = message;
    this.entete = entete;
  }
  setEnteteColor (entete) {
    switch(entete.split(' ')[0]){
      case 'REQUETE':
        //blue
        return `\x1b[34m${entete}\x1b[0m`;
      break;
      case 'RESPONSE':
        //Cyan
        return `\x1b[36m${entete}\x1b[0m`;
      break;
      case 'TITRE':
        //White
        return `\x1b[37m${entete}\x1b[0m`;
      break;
      case 'CONTENU':
        //White
        return `\x1b[37m${entete}\x1b[0m`;
      case 'AUTH':
        //Yellow
        return `\x1b[33m${entete}\x1b[0m`
      break;
      case 'SOCKET':
        //Magenta
        return `\x1b[32m${entete}\x1b[0m`
      break;
      case 'DATABASE':
        //Magenta
        return `\x1b[30m${entete}\x1b[0m`
      break;
      default:
        return entete
    }
  }
  // getContext (context) {
  //   if(!context){
  //     const fakeError = new Error();
  //     const errorOriginArray = fakeError.stack.split('\n')[2].split('\\').slice(-2);
  //     const folder = errorOriginArray[0];
  //     const fileAndLine = errorOriginArray[1];
  //     return `${folder} ${fileAndLine}`
  //   }else{
  //     return context
  //   }
  // }
  info (message, entete = '', context = this.context) {
    if(!context){
      const fakeError = new Error();
      const errorOriginArray = fakeError.stack.split('\n')[2].split('\\').slice(-2);
      const folder = errorOriginArray[0];
      const fileAndLine = errorOriginArray[1];
     context = `${folder}/${fileAndLine}`
    }else{
      context = context;
    }
    console.log('\x1b[42m[INFO]\x1b[0m',this.setEnteteColor(entete),`\x1b[35m${context}\x1b[0m`, message)
  }
  error (message, entete = '', context = this.context) {
    if(!context){
      const fakeError = new Error();
      const errorOriginArray = fakeError.stack.split('\n')[2].split('\\').slice(-2);
      const folder = errorOriginArray[0];
      const fileAndLine = errorOriginArray[1];
     context = `${folder}/${fileAndLine}`
    }else{
      context = context;
    }
    console.log('\x1b[41m[ERROR]\x1b[0m',this.setEnteteColor(entete),`\x1b[35m${context}\x1b[0m`, message)
  }
  warn (message, entete = '', context = this.context) {
    if(!context){
      const fakeError = new Error();
      const errorOriginArray = fakeError.stack.split('\n')[2].split('\\').slice(-2);
      const folder = errorOriginArray[0];
      const fileAndLine = errorOriginArray[1];
     context = `${folder}/${fileAndLine}`
    }else{
      context = context;
    }
    console.log('\x1b[43m[WARN]\x1b[0m',this.setEnteteColor(entete),`\x1b[35m${context}\x1b[0m`, message)
  }
  debug (message, entete = '', context = this.context) {
    if(!context){
      const fakeError = new Error();
      const errorOriginArray = fakeError.stack.split('\n')[2].split('\\').slice(-2);
      const folder = errorOriginArray[0];
      const fileAndLine = errorOriginArray[1];
     context = `${folder}/${fileAndLine}`
    }else{
      context = context;
    }
    console.log('\x1b[47m[DEBUG]\x1b[0m',this.setEnteteColor(entete),`\x1b[35m${context}\x1b[0m`, message)
  }
};

module.exports = () => new ConsoleDev()
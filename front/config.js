let host, apiPort, frontPort

if (process.env.NODE_ENV === 'development') {
  //set values for development environment
  host = 'http://localhost'
  apiPort = 3000
  frontPort = 3001
} else {
  //set values for production environment
  host = 'http://groupomania.now-dns.org'
  apiPort = 8080
  //you will manualy set port on "preview" script in package.json file
  frontPort = 80
}

const accessControlByAdmin = false

export { host, apiPort, frontPort, accessControlByAdmin }

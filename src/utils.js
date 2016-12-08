export function checkUri(networkInterface) {
  if (!isValidGraphcoolEndpoint(networkInterface._uri)) {
    console.error('Please specify a valid graphcool endpoint url for the network interface in src/root.js')
  }
}

function isValidGraphcoolEndpoint(uri) {
  const lastSlash = uri.lastIndexOf('/')
  const projectId = uri.slice(lastSlash + 1, uri.length)

  return isCuid(projectId)
}


function isCuid(str) {
  return /^c[^\s-]{8,}$/.test(str)
}

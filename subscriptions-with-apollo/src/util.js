import { print } from 'graphql-tag/printer';

export function addGraphQLSubscriptions(networkInterface, wsClient) {
  if (!networkInterface) {
    throw new TypeError('addGraphQLSubscriptions requires a networkInterface')
  }

  if (!wsClient) {
    throw new TypeError('addGraphQLSubscriptions requires a wsClient')
  }

  return Object.assign(networkInterface, {
    subscribe(request, cb) {
      return wsClient.subscribe({
        ...request,
        query: print(request.query)
      }, cb)
    },
    unsubscribe(id) {
      wsClient.unsubscribe(id);
    },
  })
}


export function checkUris(wsClient, networkInterface) {
  if (!isValidGraphcoolEndpoint(wsClient.url)) {
    console.error('Please specify a valid graphcool endpoint url for the websockets network interface in src/root.js')
  }

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

const ref = (key, initialValue) => {
  let _value = initialValue
  return {
    get value() {
      return _value
    },
    set value(newValue) {
      _value = newValue
      sendToAllPorts({ op: 'SET', key, value: _value })
    },
    sync(newValue, currentPort) {
      _value = newValue
      sendToAllPorts({ op: 'SET', key, value: _value }, currentPort)
    },
  }
}

const cache = {}

const portList = new Set()

const sendToAllPorts = (message, exceptPort) => {
  for (const port of portList) {
    if (exceptPort == null || port !== exceptPort) port.postMessage(message)
  }
}

console.log('qweqweqwe')

onconnect = ({ ports }) => {
  const [port] = ports

  portList.add(port)

  console.log('CACHE IN WORKER', cache)

  port.addEventListener('message', e => {
    const { op, key, value } = e.data
    console.log('MESSAGE IN WORKER', e.data)
    if (op === 'GET') {
      if (!(key in cache)) {
        cache[key] = ref(key, value)
      }
      port.postMessage({ op: 'SET', key, value: cache[key].value })
    } else if (op === 'SET') {
      if (!(key in cache)) {
        cache[key] = ref(key, value)
      } else cache[key].sync(value, port)
    }
  })

  port.start()
}

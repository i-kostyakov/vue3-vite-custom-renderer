const ref = (key, initialValue) => {
  let _value = initialValue
  return {
    get value() {
      return _value
    },
    set value(newValue) {
      _value = newValue
      postMessage({ op: 'SET', key, value: _value })
    },
    sync(newValue) {
      _value = newValue
    },
  }
}

const cache = {}

onmessage = e => {
  const { op, key, value } = e.data
  console.log('MESSAGE IN WORKER', e.data)
  if (op === 'GET') {
    if (!(key in cache)) {
      cache[key] = ref(key, value)
    }
    postMessage({ op: 'SET', key, value: cache[key].value })
  } else if (op === 'SET') {
    if (!(key in cache)) {
      cache[key] = ref(key, value)
    } else cache[key].sync(value)
  }
}

onconnect = (e) => {
  const port = e.ports[0];

  port.addEventListener('message', (e) => {
    const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    port.postMessage(workerResult);
  });

  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}
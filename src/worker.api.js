import { customRef } from '@vue/reactivity'

import MyWorker from './shared-worker.js?sharedworker'

let _worker
let _cache = {}

export const initWorker = () => {
  _worker = new MyWorker()

  _worker.port.onmessage = e => {
    const { op, key, value } = e.data
    console.log('MESSAGE IN UI THREAD', e.data)
    if (op === 'SET') {
      if (key in _cache) {
        _cache[key].sync(value)
      } else {
        console.log('Do nothing!?')
      }
    }
  }

  _worker.port.start()
}

export function useWorkerRef(key, value) {
  if (key in _cache) return _cache[key]

  let refTrigger
  const ref = customRef((track, trigger) => {
    refTrigger = trigger
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        _worker.port.postMessage({ op: 'SET', key, value })
        trigger()
      },
    }
  })
  ref.sync = newValue => {
    value = newValue
    refTrigger()
  }

  _cache[key] = ref
  _worker.port.postMessage({ op: 'GET', key, value })

  return ref
}

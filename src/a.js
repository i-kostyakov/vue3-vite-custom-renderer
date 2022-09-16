import { customRef } from '@vue/reactivity'

export function useWorkerRef(value) {
  let isSynced = false;
  const ref = customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (!isSynced) {
          console.log('Lets go sync')
        }
        isSynced = false;
        value = newValue;
        trigger();
      },
    }
  })
  ref.sync = newValue => {
    isSynced = true
    ref.value = newValue
  }

  return ref
}

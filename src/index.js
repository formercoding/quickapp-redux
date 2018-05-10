const $storeKey = 'reduxStore'
const noop = () => {}

export function connect (
  mapStateToData = () => ({}),
  {
    dispatchKey = 'dispatch',
    componentWillReceiveDataPatch = noop,
    componentDidUpdateData = noop,
  } = {}
) {
  return function wrapWithConnect (componentDef) {
    const oldOnInit = componentDef.onInit
    const oldOnDestroy = componentDef.onDestroy
    let unsubscribe
    componentDef.onInit = function onInit (...args) {
      const store = this.$app.$def[$storeKey]

      const setStateIntoData = eachEntrySetter => {
        const state = store.getState()
        const dataPatch = mapStateToData(state)
        componentWillReceiveDataPatch(this, dataPatch, state)
        Object
          .entries(dataPatch)
          .forEach(eachEntrySetter)
        componentDidUpdateData(this, dataPatch, state)
      }

      // Init store state to component data.
      // Use `component.$set()` so component setup two-ways binding.
      setStateIntoData(([key, value]) => this.$set(key, value))

      // Update store state to component data when changed
      unsubscribe = store.subscribe(() => {
        setStateIntoData(([key, value]) => {
          this[key] = value
        })
      })

      // Provide `this.dispatch()` in components.
      // `store.dispatch` would be overridded when apply middleware at runtime,
      // so always call the newest `store.dispatch()`
      this[dispatchKey] = (...args) => store.dispatch(...args)

      if (oldOnInit) oldOnInit.apply(this, args)
    }

    componentDef.onDestroy = function onDestroy (...args) {
      unsubscribe()
      if (oldOnInit) oldOnInit.apply(this, args)
    }
    return componentDef
  }
}

// eslint-disable-next-line import/prefer-default-export
export function connectApp (store, appDef) {
  // So can access `this.$app.$def.store` in components
  appDef[$storeKey] = store

  return appDef
}

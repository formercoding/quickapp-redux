let $storeKey = 'store'

function connect (
  component,
  { mapStateToDataKey = 'mapStateToData', dispatchKey = 'dispatch' } = {},
) {
  const store = component.$app.$def[$storeKey]

  // Init store state to component data
  Object
    .entries(this[mapStateToDataKey](store.getState()))
    .forEach(([key, value]) => {
      // Use `component.$set()` so component setup two-ways binding
      component.$set(key, value)
    })

  // Update store state to component data when changed
  store.subscribe(() => {
    Object
      .entries(this[mapStateToDataKey](store.getState()))
      .forEach(([key, value]) => {
        component[key] = value
      })
  })

  // Provide `this.dispatch()` in components.
  // `store.dispatch` would be overridded when apply middleware at runtime,
  // so always call the newest `store.dispatch()`
  component[dispatchKey] = (...args) => store.dispatch(...args)
}

// eslint-disable-next-line import/prefer-default-export
export function connectApp (
  store,
  appDef,
  { storeKey = $storeKey, connectKey = 'connect' } = {},
) {
  if (storeKey !== $storeKey) $storeKey = storeKey

  // So can access `this.$app.$def.store` in components
  appDef[storeKey] = store
  appDef[connectKey] = connect

  return appDef
}

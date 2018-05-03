# quickapp-redux

[快应用](https://www.quickapp.cn/) 与 [Redux.js](http://redux.js.org/) 之间的桥接层，使得当 redux.js store 数据变更时，将新数据注入快应用组件，驱动组件重新渲染。

## 使用示例

`npm install --save quickapp-redux`

```javascript
// app.mix 的 <script> 标签内部
import { connectApp } from 'quickapp-redux'
import { createStore } from 'redux'

// Just a reducer example for creating store
const store = createStore(function reducer (state = { a: 1, b: 1 }, action){
  switch (action.type) {
    case 'INCREASE_A':
      return { ...state, a: state.a + 1 }
      break;
    default:
      return state
  }
})

export default connectApp(store, {
  /**manifest**/
})
```

```javascript
// components/foo/foo.js
export default {
  onInit () {
    this.$app.$def.connect(function mapStateToData ({ a }) {
      return { a }
    }, this)
  },
  onClickSomething () {
    // 先 `connect()`，才能使用 `this.dispatch()`
    this.dispatch({ type: 'INCREASE_A' })
  },
}
```

```javascript
// components/foo/foo.mix 的 <script> 标签内部
export * from './foo'
```

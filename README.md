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
import { connect } from 'quickapp-redux'

const foo = {
  onClickSomething () {
    this.dispatch({ type: 'INCREASE_A' })
  },
}

export default connect(
  function mapStateToData ({ a }) {
    return { a }
  },
  {
    // Optionally do something after map state to data,
    // for example update UI that are not the template driven by data.
    componentWillReceiveDataPatch: (component, dataPatch, state) => {
      component.$page.setTitleBar({ text: dataPatch.a })
    },
  }
)(foo)
```

```javascript
// components/foo/foo.mix 的 <script> 标签内部
export * from './foo'
```

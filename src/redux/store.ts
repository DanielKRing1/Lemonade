import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools'

import rootReducer from './slices/rootReducer';

const store = configureStore({
    reducer: rootReducer,
    devTools: false,
    enhancers: [devToolsEnhancer({ realtime: true })]
});
export default store;
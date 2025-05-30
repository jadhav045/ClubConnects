

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";
import persistStore from "redux-persist/es/persistStore";
import store from "./store/store.js";

let persistor = persistStore(store);
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}
			>
				<App />
			</PersistGate>
		</Provider>
	</StrictMode>
);

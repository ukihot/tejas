import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./adapters/views/pages/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				{/* 他のページを増やす場合はここに追加 */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;

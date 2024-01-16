import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "./_auth/Auth";

import "./globals.scss";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/auth" element={<Auth />}/>
            <Route path="/" element={<App />}/>
        </Routes>
    </BrowserRouter>
);
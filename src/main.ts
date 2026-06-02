import "./styles/main.css";

import { createSidebar } from "./components/sidebar";
import { navigate } from "./router";
import { renderHome } from "./pages/home";

const app = document.getElementById("app");

if (!app) {
    throw new Error("Missing app");
}

const layout = document.createElement("div");
layout.className = "layout";

const sidebar = createSidebar();

const content = document.createElement("main");
content.id = "content";

layout.appendChild(sidebar);
layout.appendChild(content);

app.appendChild(layout);

navigate(renderHome());
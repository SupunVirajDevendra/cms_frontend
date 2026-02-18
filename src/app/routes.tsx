import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "../pages/Dashboard";
import CardsPage from "../pages/CardsPage";
import CardFormPage from "../pages/CardFormPage";
import CreateRequestPage from "../pages/CreateRequestPage";
import RequestsPage from "../pages/RequestsPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "cards", element: <CardsPage /> },
            { path: "cards/new", element: <CardFormPage /> },
            { path: "cards/:id", element: <CardFormPage /> },
            { path: "activate", element: <CreateRequestPage /> },
            { path: "requests", element: <RequestsPage /> },
        ],
    },
]);

export default router;

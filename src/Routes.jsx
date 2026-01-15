
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// Page imports
import Homepage from "./pages/homepage/Homepage";


const Routes = () => {
  return (
    <BrowserRouter>
        <RouterRoutes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
        </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
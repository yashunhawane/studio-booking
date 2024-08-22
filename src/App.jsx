import { Route, Routes } from "react-router-dom";
import BookingList from "./component/BookingList";
import LoginPage from "./component/LoginPage";
import PrivateRoute from "./component/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        }
      />
    </Routes>

  );
};

export default App;

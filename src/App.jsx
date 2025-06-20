import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import { AuthProvider } from "./context/useAuth";
import { CustomerProvider } from "./context/useCustomers";
import { MenuProvider } from "./context/useMenu";
import { LocationProvider } from "./context/useLocation";
import PrivateRoute from "./components/PrivateRoute";
import Customer from "./pages/Customer";
import Location from "./pages/Location";
import { DrawerProvider } from "./context/useDrawer";
import TrainModel from "./pages/TrainModel";

function App() {
  return (
    <DrawerProvider>
      <AuthProvider>
        <CustomerProvider>
          <LocationProvider>
            <MenuProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <Home />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <Home />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/menu"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <Menu />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/outlets"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <Customer />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/location"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <Location />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                 <Route
                    path="/trainModel"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <TrainModel />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </MenuProvider>
          </LocationProvider>
        </CustomerProvider>
      </AuthProvider>
    </DrawerProvider>
  );
}

export default App;

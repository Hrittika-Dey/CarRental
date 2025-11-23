import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const [cars, setCars] = useState([]);

  // NEW: loading user flag
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch logged-in user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      }
    } catch (error) {
      // No redirect here — prevents blank page
      console.error(error.message);
    }

    // Done loading
    setLoadingUser(false);
  };

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common['Authorization'] = '';
    toast.success('You have been logged out');
  };

  // Load token on start
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
    fetchCars();
  }, []);

  // Fetch user when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      fetchUser();
    } else {
      // No token: stop loading so UI renders normally
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    loadingUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

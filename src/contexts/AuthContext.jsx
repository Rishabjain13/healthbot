import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setUser } from '../store/slices/authSlice';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setUser(data?.session?.user ?? null));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

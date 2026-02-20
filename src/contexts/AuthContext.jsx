import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setUser } from '../store/slices/authSlice';

const AuthContext = createContext({});

export const AuthProvider = ({ children } children.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data session } }) => {
      dispatch(setUser(session?.user as any ?? null));
    });

    const {
      data subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        dispatch(setUser(session?.user as any ?? null));
      })();
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

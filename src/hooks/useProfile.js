import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setProfile, setProfileLoading } from '../store/slices/profileSlice';
import { RootState } from '../store/store';

export const useProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    dispatch(setProfileLoading(true));
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      dispatch(setProfile(data));
    }
    dispatch(setProfileLoading(false));
  };

  return { profile, fetchProfile };
};

import { useProfile } from '../hooks/useProfile';

export default function ProfileLoader({ children } children.ReactNode }) {
  useProfile();
  return <>{children}</>;
}

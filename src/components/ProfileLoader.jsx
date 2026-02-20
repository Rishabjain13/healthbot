import { useProfile } from '../hooks/useProfile';

export default function ProfileLoader({ children }) {
  useProfile();
  return <>{children}</>;
}

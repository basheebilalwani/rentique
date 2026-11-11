import { User } from '@/types/user.types';
import { storageRepository, simulateNetworkDelay, DEMO_CUSTOMER, DEMO_ADMIN } from '../mock/storageRepository';

export const authApi = {
  /**
   * Retrieves active demo session user.
   */
  async getCurrentUser(): Promise<User | null> {
    await simulateNetworkDelay(100);
    return storageRepository.getAuthUser();
  },

  /**
   * Simulates authentication login.
   */
  async login(email: string): Promise<User> {
    await simulateNetworkDelay(250);
    const isAdmin = email.toLowerCase().includes('admin');
    const user: User = isAdmin ? { ...DEMO_ADMIN, email } : { ...DEMO_CUSTOMER, email };
    storageRepository.setAuthUser(user);
    return user;
  },

  /**
   * Switch roles between Customer and Admin for seamless evaluation.
   */
  async switchRole(role: 'customer' | 'admin'): Promise<User> {
    await simulateNetworkDelay(150);
    const user = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
    storageRepository.setAuthUser(user);
    return user;
  },

  /**
   * Clears session.
   */
  async logout(): Promise<void> {
    await simulateNetworkDelay(150);
    storageRepository.setAuthUser(null);
  },
};

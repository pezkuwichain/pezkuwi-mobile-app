import AsyncStorage from '@react-native-async-storage/async-storage';
import * as bcrypt from 'bcryptjs';
import WalletService from './WalletService';

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  walletAddress?: string;
}

interface AuthSession {
  userId: string;
  email: string;
  name: string;
  token: string;
  expiresAt: number;
}

class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register new user
   */
  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate inputs
      if (!this.validateEmail(email)) {
        return { success: false, message: 'Invalid email address' };
      }

      if (password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters' };
      }

      if (!name || name.trim().length < 2) {
        return { success: false, message: 'Name must be at least 2 characters' };
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user: User = {
        id: this.generateId(),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        createdAt: Date.now(),
      };

      // Save user
      await this.saveUser(user);

      // Create wallet automatically
      try {
        const wallet = await WalletService.createWallet();
        user.walletAddress = wallet.address;
        await this.saveUser(user); // Update user with wallet address
      } catch (error) {
        console.error('Failed to create wallet during signup:', error);
        // Continue without wallet - user can create later
      }

      // Create session
      await this.createSession(user);

      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate inputs
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      // Get user
      const user = await this.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Load wallet if exists
      if (user.walletAddress) {
        try {
          await WalletService.loadWallet();
        } catch (error) {
          console.error('Failed to load wallet during signin:', error);
        }
      }

      // Create session
      await this.createSession(user);

      return { success: true, message: 'Signed in successfully' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, message: 'Failed to sign in. Please try again.' };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_session');
      this.currentSession = null;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getSession();
      if (!session) {
        return false;
      }

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        await this.signOut();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      if (this.currentSession) {
        return this.currentSession;
      }

      const sessionData = await AsyncStorage.getItem('auth_session');
      if (!sessionData) {
        return null;
      }

      this.currentSession = JSON.parse(sessionData);
      return this.currentSession;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      if (!session) {
        return null;
      }

      return await this.getUserById(session.userId);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(name: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Not authenticated' };
      }

      user.name = name.trim();
      await this.saveUser(user);

      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Not authenticated' };
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Validate new password
      if (newPassword.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters' };
      }

      // Hash new password
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await this.saveUser(user);

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  /**
   * Reset password (simplified - in production would send email)
   */
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      // In production, send email with reset token
      // For now, just return success
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Failed to reset password' };
    }
  }

  /**
   * Create session for user
   */
  private async createSession(user: User): Promise<void> {
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      token: this.generateToken(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    };

    await AsyncStorage.setItem('auth_session', JSON.stringify(session));
    this.currentSession = session;
  }

  /**
   * Save user to storage
   */
  private async saveUser(user: User): Promise<void> {
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }

    await AsyncStorage.setItem('users', JSON.stringify(users));
  }

  /**
   * Get user by email
   */
  private async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.email === email.toLowerCase().trim()) || null;
  }

  /**
   * Get user by ID
   */
  private async getUserById(id: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  /**
   * Get all users
   */
  private async getAllUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem('users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate session token
   */
  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }
}

export default AuthService.getInstance();


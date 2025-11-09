import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n({
  en: {
    welcome: 'Welcome',
    home: 'Home',
    wallet: 'Wallet',
    citizens: 'Citizens',
    referral: 'Referral',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    signOut: 'Sign Out',
    language: 'Language',
    darkMode: 'Dark Mode',
    // Add more translations
  },
  'ku-sorani': {
    welcome: 'بەخێربێیت',
    home: 'سەرەکی',
    wallet: 'جزدان',
    citizens: 'هاوڵاتیان',
    referral: 'ئاماژە',
    profile: 'پرۆفایل',
    settings: 'ڕێکخستنەکان',
    notifications: 'ئاگادارکردنەوەکان',
    editProfile: 'دەستکاری پرۆفایل',
    changePassword: 'گۆڕینی وشەی نهێنی',
    signOut: 'چوونەدەرەوە',
    language: 'زمان',
    darkMode: 'دۆخی تاریک',
  },
  'ku-kurmanji': {
    welcome: 'Bi xêr hatî',
    home: 'Malper',
    wallet: 'Berîk',
    citizens: 'Hemwelatî',
    referral: 'Referans',
    profile: 'Profîl',
    settings: 'Mîhengên',
    notifications: 'Agahdarî',
    editProfile: 'Profîlê Biguherîne',
    changePassword: 'Şîfreyê Biguherîne',
    signOut: 'Derkeve',
    language: 'Ziman',
    darkMode: 'Moda Tarî',
  },
  ar: {
    welcome: 'مرحبا',
    home: 'الرئيسية',
    wallet: 'المحفظة',
    citizens: 'المواطنون',
    referral: 'الإحالة',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    editProfile: 'تعديل الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    signOut: 'تسجيل الخروج',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
  },
  tr: {
    welcome: 'Hoş geldiniz',
    home: 'Ana Sayfa',
    wallet: 'Cüzdan',
    citizens: 'Vatandaşlar',
    referral: 'Yönlendirme',
    profile: 'Profil',
    settings: 'Ayarlar',
    notifications: 'Bildirimler',
    editProfile: 'Profili Düzenle',
    changePassword: 'Şifre Değiştir',
    signOut: 'Çıkış Yap',
    language: 'Dil',
    darkMode: 'Karanlık Mod',
  },
  fa: {
    welcome: 'خوش آمدید',
    home: 'خانه',
    wallet: 'کیف پول',
    citizens: 'شهروندان',
    referral: 'ارجاع',
    profile: 'پروفایل',
    settings: 'تنظیمات',
    notifications: 'اطلاعیه‌ها',
    editProfile: 'ویرایش پروفایل',
    changePassword: 'تغییر رمز عبور',
    signOut: 'خروج',
    language: 'زبان',
    darkMode: 'حالت تاریک',
  },
});

// Set default locale
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Get device locale safely (handle web platform where it might be undefined)
const getDeviceLocale = () => {
  try {
    const locale = Localization.getLocales?.()?.[0]?.languageCode || 
                   Localization.locale || 
                   'en';
    return typeof locale === 'string' ? locale.split('-')[0] : 'en';
  } catch (error) {
    return 'en';
  }
};

i18n.locale = getDeviceLocale();

export const loadSavedLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('appLanguage');
    if (savedLang) {
      i18n.locale = savedLang;
    }
  } catch (error) {
    console.error('Error loading language:', error);
  }
};

export const saveLanguage = async (languageCode: string) => {
  try {
    await AsyncStorage.setItem('appLanguage', languageCode);
    i18n.locale = languageCode;
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default i18n;
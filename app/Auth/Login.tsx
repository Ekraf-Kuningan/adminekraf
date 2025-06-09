import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, useColorScheme, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const primaryColor = '#FFAA01';
const lightTextColor = '#000000';
const lightSubTextColor = '#6B7280';
const lightPlaceholderColor = '#9CA3AF';
const lightBorderColor = '#D1D5DB';

const darkTextColor = '#FFFFFF';
const darkSubTextColor = '#A0A0A0';
const darkPlaceholderColor = '#777777';
const darkBorderColor = '#555555';

export default function Login({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const iconColor = isDarkMode ? '#FFFFFF' : '#757575';


  const currentTextColor = isDarkMode ? darkTextColor : lightTextColor;
  const currentSubTextColor = isDarkMode ? darkSubTextColor : lightSubTextColor;
  const currentPlaceholderColor = isDarkMode ? darkPlaceholderColor : lightPlaceholderColor;
  const currentBorderColor = isDarkMode ? darkBorderColor : lightBorderColor;
  const currentInputBackgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const currentBackgroundColor = isDarkMode ? '#121212' : '#FFFFFF';
  const linkTextColor = isDarkMode ? 'text-[#FFAA01]' : 'text-[#FFAA01]';


  return (
    <View style={[styles.container, { backgroundColor: currentBackgroundColor }]}>
      <StatusBar
        backgroundColor={currentBackgroundColor}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <View style={styles.headerContainer}>
           <Image
                    source={require('../../assets/images/LogoText.png')}
                    className="w-72 h-249 mb-3"
                    resizeMode="contain"
                  />
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeTitle, { color: currentTextColor }]}>Selamat Datang</Text>
        <Text style={[styles.welcomeSubtitle, { color: currentSubTextColor }]}>
          Mohon isi email dan kata sandi untuk melanjutkan
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: currentTextColor }]}>Email</Text>
        <View style={[styles.inputWrapper, { borderColor: currentBorderColor, backgroundColor: currentInputBackgroundColor }]}>
          <Icon name="mail-outline" size={24} color={iconColor} className='p-2' />
          <TextInput
            style={[styles.input, { color: currentTextColor }]}
            placeholder="Masukkan email disini"
            placeholderTextColor={currentPlaceholderColor}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.label, { color: currentTextColor }]}>Kata Sandi</Text>
        <View style={[styles.inputWrapper, { borderColor: currentBorderColor, backgroundColor: currentInputBackgroundColor }]}>
          <Icon name="lock-closed-outline" size={24} color={iconColor} className='p-2' />
          <TextInput
            style={[styles.input, { color: currentTextColor }]}
            placeholder="Masukkan kata sandi disini"
            placeholderTextColor={currentPlaceholderColor}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Icon
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={currentPlaceholderColor}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={[styles.forgotPasswordText, { color: primaryColor }]}>Lupa Kata Sandi?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.loginButton, { backgroundColor: primaryColor }]} onPress={() => navigation.navigate('NavigationBottom')}>
        <Text style={styles.loginButtonText}>Masuk</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text className={`text-lg font-semibold font-poppins-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Tidak punya akun?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className={`text-lg font-semibold font-poppins-bold ${linkTextColor}`} >Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  titleContainer: {
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    lineHeight: 28,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
    width: '100%',
  },
  welcomeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'left',
  },
  welcomeSubtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
    height: 50,
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  registerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginLeft: 5,
  },
});
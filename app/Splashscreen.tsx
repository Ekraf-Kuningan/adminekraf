import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, useColorScheme, StatusBar, Animated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {LinearGradient} from 'react-native-linear-gradient';
import { colors } from '../constants/colors';

export default function SplashScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const iconFadeAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.5)).current;

  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 700,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateYAnim, {
          toValue: 0,
          duration: 700,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const totalAnimationDuration = 800 + 700 + 200;
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, totalAnimationDuration + 500);

    return () => clearTimeout(timer);
  }, [navigation, iconFadeAnim, iconScaleAnim, textFadeAnim, textTranslateYAnim]);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: iconFadeAnim,
            transform: [{ scale: iconScaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/images/ekraf.png')}
          style={styles.logo}
        />
        <Animated.Image
          source={require('../assets/images/SplashText.png')}
          style={[
            styles.splashTextLogo,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textTranslateYAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.directedBy, isDarkMode ? styles.darkText : styles.lightText]}>Directed by :</Text>
        <View style={styles.footerLogos}>
          <Image
            source={require('../assets/images/ekraf-pusat.png')}
            style={styles.footerLogo}
          />
          <Image
            source={require('../assets/images/disporapar.png')}
            style={styles.footerLogo}
          />
        </View>
      </View>
    </View>
  );
}

type GradientColorProps = {
  text: string;
};

const GradientColor = ({ text }: GradientColorProps) => {
  return (
    <MaskedView maskElement={<Text style={{ textAlign: 'center', fontFamily:'Poppins-SemiBold',fontSize:20 }}>{text}</Text>}>
      <LinearGradient
        colors={['#FFAA01', '#1F6361']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={{ textAlign: 'center', fontFamily:'Poppins-SemiBold', fontSize:30 }}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  splashTextLogo: {
    width: 200,
    height: 60,
    marginBottom: 3,
    resizeMode: 'contain',
  },
  logoText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  directedBy: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  footerLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  footerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginHorizontal: 30,
  },
});

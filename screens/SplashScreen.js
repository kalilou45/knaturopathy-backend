import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  
  // 12 feuilles de lierre
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    x: useRef(new Animated.Value(0)).current,
    y: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    rotate: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
    angle: (i * 30) * (Math.PI / 180),
  }));

  useEffect(() => {
    Animated.sequence([
      // 1. Logo apparaît
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      
      // 2. Texte "KNaturo" apparaît
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // 3. Lierres poussent
      Animated.parallel(
        leaves.map((leaf, i) => {
          const distance = Math.max(width, height) * 0.8;
          const targetX = Math.cos(leaf.angle) * distance;
          const targetY = Math.sin(leaf.angle) * distance;
          
          return Animated.parallel([
            Animated.timing(leaf.x, {
              toValue: targetX,
              duration: 1800,
              delay: i * 80,
              useNativeDriver: true,
            }),
            Animated.timing(leaf.y, {
              toValue: targetY,
              duration: 1800,
              delay: i * 80,
              useNativeDriver: true,
            }),
            Animated.timing(leaf.scale, {
              toValue: 1.5,
              duration: 1800,
              delay: i * 80,
              useNativeDriver: true,
            }),
            Animated.timing(leaf.rotate, {
              toValue: Math.random() * 360,
              duration: 1800,
              delay: i * 80,
              useNativeDriver: true,
            }),
            Animated.timing(leaf.opacity, {
              toValue: 0.9,
              duration: 400,
              delay: i * 80,
              useNativeDriver: true,
            }),
          ]);
        })
      ),
      
      // 4. Pause
      Animated.delay(600),
      
      // 5. Fade out
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <View style={styles.background} />
      
      {leaves.map((leaf, i) => (
        <Animated.View
          key={i}
          style={[
            styles.leaf,
            {
              transform: [
                { translateX: leaf.x },
                { translateY: leaf.y },
                { scale: leaf.scale },
                { rotate: leaf.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                })},
              ],
              opacity: leaf.opacity,
            },
          ]}
        />
      ))}
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../assets/logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.brandText, { opacity: textOpacity }]}>
          KNaturo
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1B4332',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  brandText: {
    marginTop: 20,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E8F5E9',
    letterSpacing: 4,
  },
  leaf: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: '#52B788',
    borderRadius: 18,
    borderTopLeftRadius: 0,
  },
});

export default SplashScreen;

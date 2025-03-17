import { Animated, Easing } from 'react-native';

export class Animations {
  // Animation d'entrée pour les cartes et modales
  static fadeInScale(
    animValue: Animated.Value,
    duration = 300,
    delay = 0,
    callback?: () => void
  ): void {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(callback ? ({ finished }) => finished && callback() : undefined);
  }

  // Animation de sortie pour les cartes et modales
  static fadeOutScale(
    animValue: Animated.Value,
    duration = 250,
    delay = 0,
    callback?: () => void
  ): void {
    Animated.timing(animValue, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(callback ? ({ finished }) => finished && callback() : undefined);
  }

  // Animation de rebond (spring) pour les interactions
  static springAnimation(
    animValue: Animated.Value,
    toValue: number,
    friction = 6,
    tension = 40,
    callback?: () => void
  ): void {
    Animated.spring(animValue, {
      toValue,
      friction,
      tension,
      useNativeDriver: true,
    }).start(callback ? ({ finished }) => finished && callback() : undefined);
  }

  // Animation de type "breathe" pour les éléments cybernétiques
  static pulseAnimation(
    animValue: Animated.Value,
    minValue = 0.8,
    maxValue = 1.1,
    duration = 1500,
    callback?: () => void
  ): void {
    animValue.setValue(minValue);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: maxValue,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: minValue,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Animation de type "scan" pour les éléments de chargement
  static scanAnimation(
    animValue: Animated.Value,
    duration = 2000,
    callback?: () => void
  ): void {
    animValue.setValue(0);
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start(callback);
  }

  // Animation de dégradé cybernétique (à utiliser avec un composant GradientBox)
  static cyberGradientAnimation(
    animValue: Animated.Value,
    duration = 3000,
    callback?: () => void
  ): void {
    animValue.setValue(0);
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false, // Les couleurs ne peuvent pas utiliser useNativeDriver
      })
    ).start(callback);
  }

  // Animation de glissement pour les notifications
  static slideInNotification(
    animValue: Animated.Value,
    duration = 300,
    callback?: () => void
  ): void {
    animValue.setValue(-50);
    Animated.spring(animValue, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(callback);
  }

  // Animation de sortie pour les notifications
  static slideOutNotification(
    animValue: Animated.Value,
    duration = 300,
    callback?: () => void
  ): void {
    Animated.timing(animValue, {
      toValue: -50,
      duration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(callback);
  }
}
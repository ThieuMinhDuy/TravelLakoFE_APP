import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

/**
 * Type-Safe Navigation Hook
 * Eliminates typo risks when calling navigation.navigate(...)
 */
export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamList>>();
};

/**
 * Type-Safe Route Hook
 */
export const useAppRoute = <RouteName extends keyof RootStackParamList>() => {
  return useRoute<RouteProp<RootStackParamList, RouteName>>();
};


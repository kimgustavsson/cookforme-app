import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  HomeScreen,
  RecipeReviewScreen,
  RecipeDetailScreen,
  CookModeScreen,
  SearchScreen,
  ArchiveScreen,
} from '@/features/recipes';
import { ProfileScreen } from '@/features/auth';
import type { AppTabParamList, RecipesStackParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();
const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();

// Home 탭은 자체 스택을 가집니다 (입력 → 확인 → 상세 → 요리모드 흐름).
function HomeStackNavigator() {
  return (
    <RecipesStack.Navigator>
      <RecipesStack.Screen name="Home" component={HomeScreen} options={{ title: 'Cooking Archive' }} />
      <RecipesStack.Screen name="RecipeReview" component={RecipeReviewScreen} options={{ title: '확인' }} />
      <RecipesStack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: '' }} />
      <RecipesStack.Screen name="CookMode" component={CookModeScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
    </RecipesStack.Navigator>
  );
}

export function AppTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: t('common.home') }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: t('common.search') }} />
      <Tab.Screen name="Archive" component={ArchiveScreen} options={{ title: t('common.archive') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('common.profile') }} />
    </Tab.Navigator>
  );
}

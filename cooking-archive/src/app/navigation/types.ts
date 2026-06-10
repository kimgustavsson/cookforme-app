import type { NavigatorScreenParams } from "@react-navigation/native";

// 네비게이션 파라미터를 한곳에서 타입으로 관리.
// 화면 추가 시 여기에 등록하면 navigate() 호출이 타입 체크됩니다.
export type RecipesStackParamList = {
  Home: undefined;
  RecipeReview: { recipeId: string };
  RecipeDetail: { recipeId: string };
  CookMode: { recipeId: string };
};

export type AppTabParamList = {
  HomeTab: NavigatorScreenParams<RecipesStackParamList>;
  Search: undefined;
  Archive: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// 루트 네비게이터. Splash → Auth/Onboarding/App(탭)으로 분기.
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: undefined;
  App: NavigatorScreenParams<AppTabParamList>;
};

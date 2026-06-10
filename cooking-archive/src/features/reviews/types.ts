// 개인별 미식 평가. 한 레시피에 멤버마다 한 행.
export interface RecipeReview {
  id: string;
  recipeId: string;
  userId: string;        // 남편/아내가 아니라 그냥 유저 id
  rating: number;        // 1–5
  comment?: string;      // "이건 짜다", "감자 더 크게"
  cookedAt?: string;     // 해 먹은 날
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;          // "우리집 주방", "스웨덴 자취방 모임"
  createdBy: string;
  createdAt: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  joinedAt: string;
}

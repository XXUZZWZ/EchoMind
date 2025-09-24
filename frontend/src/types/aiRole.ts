
export interface AiRoleItem {
  id: string;
  prompt: string;
  placeholder: string;
  imageUrl: string;
}

export interface AiRoleListStore {
  aiRoleList: AiRoleItem[];
  loading: boolean;
  page: number;
  fetchMoreAiRoleList: () => Promise<void>;
}
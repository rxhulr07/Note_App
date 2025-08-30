export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  isPinned: boolean;
  tags: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

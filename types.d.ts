export interface IPost {
  _id: string;
  _createdAt: string;
  user: string;
  content: string;
  image: string;
}

export interface IComment {
  _createdAt: string;
  _id: string;
  user: string;
  postId: string;
  content: string;
}

export interface ILike {
  _id;
  postId: string;
  from: string;
}

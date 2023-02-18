export const fetchPosts = `*[_type == "post"] | order(_createdAt desc) {
    _id,
    _createdAt,
    user,
    content,
    image
}`;

export const fetchPost = (id: any) => {
  const query = `*[_type == "post" && _id == "${id}"] {
        _id,
        _createdAt,
        user,
        content,
        image
    }`;
  return query;
};

export const fetchComments = (id: any) => {
  const query = `*[_type == "comment" && postId == "${id}"]{
    _id,
    _createdAt,
    user,
    content
  }`;
  return query;
};

export const fetchLikes = (id: any) => {
  const query = `*[_type == "like" && postId == "${id}"]{
    _id,
    postId,
    from
  }`;
  return query;
};

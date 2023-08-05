const isProduction = process.env.NODE_ENV === "production";
export const apiUrl = isProduction
  ? "https://askify-server.onrender.com"
  : "http://localhost:4000";

function fetcher(path: string, options?: RequestInit) {
  if (path[0] !== "/") path = "/" + path;
  return fetch(apiUrl + path, options);
}

export const api = {
  async askQuestion(userHandle: string, body) {
    const response = await fetcher(`/users/${userHandle}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { response, data };
  },

  async logout() {
    await fetcher("/users/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  async likeAnswer(answerId: string) {
    const response = await fetcher(`/questions/${answerId}/likes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return { response };
  },

  async unlikeAnswer(answerId: string) {
    const response = await fetcher(`/questions/${answerId}/likes`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return { response };
  },

  async isLiked(answerId: string) {
    const response = await fetcher(`/questions/${answerId}/likes`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return { response, data };
  },

  async addComment(answerId: string, content: string) {
    const response = await fetcher(`/questions/${answerId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return { response };
  },

  async deleteQuestion(questionId: string) {
    const response = await fetcher(`/questions/${questionId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return { response };
  },

  async answerQuestion(questionId: string, answer: string) {
    const response = await fetcher(`/questions/${questionId}/answer`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    return { response };
  },

  async deleteAnswer(answerId: string) {
    const response = await fetcher(`/questions/${answerId}/answer`, {
      method: "DELETE",
      credentials: "include",
    });

    return { response };
  },

  async changeQuestionCategory(questionId: string, categoryId: string) {
    const response = await fetcher(`/questions/${questionId}/category`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ category: categoryId }),
    });

    return { response };
  },

  async getInbox(
    query: string,
    regex: boolean,
    sort: "newest" | "oldest",
    categoryId: string,
    page: number,
    options: RequestInit
  ) {
    const reg = regex ? "&regex" : "";
    const qs = `q=${query}${reg}&sort=${sort}&cat=${categoryId}&page=${page}`;

    const response = await fetcher(`/users/me/inbox?${qs}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await response.json();
    return { response, data };
  },

  async getUserAnswers(
    userHandle: string,
    query: string,
    regex: boolean,
    sort: "newest" | "oldest",
    categoryId: string,
    page: number,
    options: RequestInit
  ) {
    const reg = regex ? "&regex" : "";
    const qs = `q=${query}${reg}&sort=${sort}&cat=${categoryId}&page=${page}`;

    const response = await fetcher(`/users/${userHandle}/questions?${qs}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await response.json();
    return { response, data };
  },

  async loadProfile(userHandle: string, options: RequestInit) {
    const response = await fetcher(`/users/${userHandle}`, options);
    const data = await response.json();
    return { response, data };
  },

  async loadUser() {
    const response = await fetcher("/users/me", { credentials: "include" });
    const data = await response.json();
    return { response, data };
  },

  async loadCategories() {
    const response = await fetcher("/users/me/categories", {
      credentials: "include",
    });
    const data = await response.json();
    return { response, data };
  },

  async login(login: string, password: string, remember: boolean) {
    const response = await fetcher("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password, remember }),
      credentials: "include",
    });

    const data = await response.json();

    return { response, data };
  },

  async signup(body) {
    const response = await fetcher("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { response, data };
  },

  async deleteComment(commentId: string) {
    const response = await fetcher(`/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return { response };
  },

  async editComment(commentId: string, content: string) {
    const response = await fetcher(`/comments/${commentId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return { response };
  },

  async getQuestion(questionId: string) {
    const response = await fetcher(`/questions/${questionId}`);
    const data = await response.json();

    return { response, data };
  },

  async getComments(questionId: string) {
    const response = await fetcher(`/questions/${questionId}/comments`);
    const data = await response.json();

    return { response, data };
  },

  async updateUser(patch) {
    const response = await fetcher("/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(patch),
    });
    const data = await response.json();

    return { response, data };
  },
};

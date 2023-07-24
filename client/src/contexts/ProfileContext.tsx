import { createContext, useEffect, useReducer } from "react";
import { api } from "../api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  allowAnonymous: boolean;
  categories: { id: string; name: string }[];
}

interface Profile {
  user?: User;
  query: string;
  sort: "newest" | "oldest";
  category: string;
  isRegex: boolean;
  page: number;
  loading: boolean;
  hasMore: boolean;
  questions: any[];
}

const initProfile: Profile = {
  query: "",
  sort: "newest",
  category: "all",
  isRegex: false,
  page: 1,
  loading: false,
  hasMore: true,
  questions: [],
};

export enum ProfileActions {
  Set,
  Reset,
  Update,
  AppendQuestions,
  RemoveQuestion,
  UpdateQuestion,
  FetchNext,
}

type State = Profile;

type Action =
  | { type: ProfileActions.Set; payload: Profile }
  | { type: ProfileActions.Reset }
  | { type: ProfileActions.Update; payload: Partial<Profile> }
  | { type: ProfileActions.AppendQuestions; payload: any[] }
  | { type: ProfileActions.RemoveQuestion; payload: { id: string } }
  | {
      type: ProfileActions.UpdateQuestion;
      payload: { id: string; update: Record<string, any> };
    }
  | { type: ProfileActions.FetchNext };

const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ProfileActions.Set:
      return action.payload;
    case ProfileActions.Reset:
      return initProfile;
    case ProfileActions.Update:
      return { ...state, ...action.payload };
    case ProfileActions.AppendQuestions:
      return {
        ...state,
        questions: [...state.questions, ...action.payload],
      };
    case ProfileActions.RemoveQuestion:
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload.id),
      };
    case ProfileActions.UpdateQuestion:
      const updated: any[] = [];

      state.questions.forEach((q) => {
        if (q.id === action.payload.id) {
          q = { ...q, ...action.payload.update };
        }
        if (state.category === "all" || state.category === q.category) {
          updated.push(q);
        }
      });

      return {
        ...state,
        questions: updated,
      };
    case ProfileActions.FetchNext:
      return {
        ...state,
        page: state.page + 1,
      };
    default:
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

export const ProfileContext = createContext<{
  profile: State;
  profileDispatch: React.Dispatch<Action>;
  deleteQuestion: (id: string) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
  changeQuestionCategory: (id: string, category: string) => Promise<void>;
  answerQuestion: (id: string, answer: string) => Promise<void>;
}>({
  profile: initProfile,
  profileDispatch: () => {},
  deleteQuestion: async (id) => {},
  deleteAnswer: async (id) => {},
  changeQuestionCategory: async (id, cat) => {},
  answerQuestion: async (id, ans) => {},
});

export const ProfileProvider = ({ children, username }) => {
  const [profile, profileDispatch] = useReducer(profileReducer, initProfile);
  const { category, isRegex, page, query, sort } = profile;

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const { response, data } = await api.loadProfile(username, {
          signal: controller.signal,
        });

        if (response.ok) {
          profileDispatch({
            type: ProfileActions.Update,
            payload: { user: data },
          });
        }
      } catch {}
      // should handle errors
    }

    loadProfile();

    return () => controller.abort();
  }, [username]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        profileDispatch({
          type: ProfileActions.Update,
          payload: { loading: true },
        });

        const { response, data } = await api.getUserAnswers(
          username,
          query,
          isRegex,
          sort,
          category,
          page,
          { signal: controller.signal }
        );

        if (response.ok) {
          if (page === 1) {
            profileDispatch({
              type: ProfileActions.Update,
              payload: { questions: data.questions },
            });
          } else {
            profileDispatch({
              type: ProfileActions.AppendQuestions,
              payload: data.questions,
            });
          }

          profileDispatch({
            type: ProfileActions.Update,
            payload: { hasMore: Boolean(data.questions.length) },
          });
        } else {
          profileDispatch({
            type: ProfileActions.Update,
            payload: { hasMore: false },
          });
        }
      } catch {
        profileDispatch({
          type: ProfileActions.Update,
          payload: { hasMore: false },
        });
      }

      profileDispatch({
        type: ProfileActions.Update,
        payload: { loading: false },
      });
    }

    fetchData();

    return () => controller.abort();
  }, [category, isRegex, page, query, sort, username]);

  async function deleteQuestion(id: string) {
    const { response } = await api.deleteQuestion(id);

    if (response.ok) {
      profileDispatch({ type: ProfileActions.RemoveQuestion, payload: { id } });
    }
    // should handle errors ^_^
  }

  async function answerQuestion(id: string, answer: string) {
    const { response } = await api.answerQuestion(id, answer);

    if (response.ok) {
      profileDispatch({
        type: ProfileActions.UpdateQuestion,
        payload: { id, update: { answer } },
      });
    }
    // should handle errors ^_^
  }

  async function deleteAnswer(id: string) {
    const { response } = await api.deleteAnswer(id);

    if (response.ok) {
      profileDispatch({
        type: ProfileActions.RemoveQuestion,
        payload: { id },
      });
    }
    // should handle errors ^_^
  }

  async function changeQuestionCategory(id: string, category: string) {
    const { response } = await api.changeQuestionCategory(id, category);

    if (response.ok) {
      profileDispatch({
        type: ProfileActions.UpdateQuestion,
        payload: { id, update: { category } },
      });
    }
    // should handle errors ^_^
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profileDispatch,
        deleteQuestion,
        changeQuestionCategory,
        answerQuestion,
        deleteAnswer,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;

import { createContext, useEffect, useReducer } from "react";
import { api } from "../api";

interface Inbox {
  query: string;
  sort: "newest" | "oldest";
  category: string;
  isRegex: boolean;
  page: number;
  loading: boolean;
  hasMore: boolean;
  questions: any[];
}

const initInbox: Inbox = {
  query: "",
  sort: "newest",
  category: "all",
  isRegex: false,
  page: 1,
  loading: false,
  hasMore: true,
  questions: [],
};

export enum InboxActions {
  Set,
  Reset,
  Update,
  AppendQuestions,
  RemoveQuestion,
  UpdateQuestion,
  FetchNext,
}

type State = Inbox;

type Action =
  | { type: InboxActions.Set; payload: Inbox }
  | { type: InboxActions.Reset }
  | { type: InboxActions.Update; payload: Partial<Inbox> }
  | { type: InboxActions.AppendQuestions; payload: any[] }
  | { type: InboxActions.RemoveQuestion; payload: { id: string } }
  | {
      type: InboxActions.UpdateQuestion;
      payload: { id: string; update: Record<string, any> };
    }
  | { type: InboxActions.FetchNext };

const inboxReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case InboxActions.Set:
      return action.payload;
    case InboxActions.Reset:
      return initInbox;
    case InboxActions.Update:
      return { ...state, ...action.payload };
    case InboxActions.AppendQuestions:
      return {
        ...state,
        questions: [...state.questions, ...action.payload],
      };
    case InboxActions.RemoveQuestion:
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload.id),
      };
    case InboxActions.UpdateQuestion:
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
    case InboxActions.FetchNext:
      return {
        ...state,
        page: state.page + 1,
      };
    default:
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

export const InboxContext = createContext<{
  inbox: State;
  inboxDispatch: React.Dispatch<Action>;
  deleteQuestion: (id: string) => Promise<void>;
  changeQuestionCategory: (id: string, category: string) => Promise<void>;
  answerQuestion: (id: string, answer: string) => Promise<void>;
}>({
  inbox: initInbox,
  inboxDispatch: () => {},
  deleteQuestion: async (id) => {},
  changeQuestionCategory: async (id, cat) => {},
  answerQuestion: async (id, ans) => {},
});

export const InboxProvider = ({ children }) => {
  const [inbox, inboxDispatch] = useReducer(inboxReducer, initInbox);
  const { category, isRegex, page, query, sort } = inbox;

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        inboxDispatch({
          type: InboxActions.Update,
          payload: { loading: true },
        });

        const { response, data } = await api.getInbox(
          query,
          isRegex,
          sort,
          category,
          page,
          { signal: controller.signal }
        );

        if (response.ok) {
          if (page === 1) {
            inboxDispatch({
              type: InboxActions.Update,
              payload: { questions: data.questions },
            });
          } else {
            inboxDispatch({
              type: InboxActions.AppendQuestions,
              payload: data.questions,
            });
          }

          inboxDispatch({
            type: InboxActions.Update,
            payload: { hasMore: Boolean(data.questions.length) },
          });
        } else {
          inboxDispatch({
            type: InboxActions.Update,
            payload: { hasMore: false },
          });
        }
      } catch {
        inboxDispatch({
          type: InboxActions.Update,
          payload: { hasMore: false },
        });
      }

      inboxDispatch({
        type: InboxActions.Update,
        payload: { loading: false },
      });
    }

    fetchData();

    return () => controller.abort();
  }, [category, isRegex, page, query, sort]);

  async function deleteQuestion(id: string) {
    const { response } = await api.deleteQuestion(id);

    if (response.ok) {
      inboxDispatch({ type: InboxActions.RemoveQuestion, payload: { id } });
    }
    // should handle errors ^_^
  }

  async function answerQuestion(id: string, answer: string) {
    const { response } = await api.answerQuestion(id, answer);

    if (response.ok) {
      inboxDispatch({ type: InboxActions.RemoveQuestion, payload: { id } });
    }
    // should handle errors ^_^
  }

  async function changeQuestionCategory(id: string, category: string) {
    const { response } = await api.changeQuestionCategory(id, category);

    if (response.ok) {
      inboxDispatch({
        type: InboxActions.UpdateQuestion,
        payload: { id, update: { category } },
      });
    }
    // should handle errors ^_^
  }

  return (
    <InboxContext.Provider
      value={{
        inbox,
        inboxDispatch,
        deleteQuestion,
        changeQuestionCategory,
        answerQuestion,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};

export default InboxProvider;

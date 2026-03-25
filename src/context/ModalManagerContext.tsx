"use client";

import {
  createContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { GoogleSheetsModal } from "@/components/GoogleSheetsModal/GoogleSheetsModal";
import type {
  ModalState,
  ModalAction,
  ModalManagerContextValue,
  EmbedMode,
} from "@/components/GoogleSheetsModal/types";

const initialState: ModalState = {
  modals: [],
  nextZIndex: 1000,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        modals: [
          ...state.modals,
          { ...action.payload, zIndex: state.nextZIndex },
        ],
        nextZIndex: state.nextZIndex + 1,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        modals: state.modals.filter((m) => m.id !== action.payload.id),
      };
    case "CLOSE_ALL":
      return { ...state, modals: [] };
    case "BRING_TO_FRONT":
      return {
        modals: state.modals.map((m) =>
          m.id === action.payload.id ? { ...m, zIndex: state.nextZIndex } : m
        ),
        nextZIndex: state.nextZIndex + 1,
      };
    default:
      return state;
  }
}

export const ModalManagerContext = createContext<ModalManagerContextValue | null>(
  null
);

export function ModalManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const openSheet = useCallback(
    (url: string, opts?: { title?: string; mode?: EmbedMode }): string => {
      const id = crypto.randomUUID();
      dispatch({
        type: "OPEN_MODAL",
        payload: {
          id,
          url,
          title: opts?.title,
          mode: opts?.mode ?? "edit",
        },
      });
      return id;
    },
    []
  );

  const closeSheet = useCallback((id: string) => {
    dispatch({ type: "CLOSE_MODAL", payload: { id } });
  }, []);

  const closeAll = useCallback(() => {
    dispatch({ type: "CLOSE_ALL" });
  }, []);

  const bringToFront = useCallback((id: string) => {
    dispatch({ type: "BRING_TO_FRONT", payload: { id } });
  }, []);

  return (
    <ModalManagerContext.Provider
      value={{ modals: state.modals, openSheet, closeSheet, closeAll, bringToFront }}
    >
      {children}
      {state.modals.map((modal) => (
        <GoogleSheetsModal
          key={modal.id}
          url={modal.url}
          isOpen={true}
          onClose={() => closeSheet(modal.id)}
          title={modal.title}
          mode={modal.mode}
          zIndex={modal.zIndex}
        />
      ))}
    </ModalManagerContext.Provider>
  );
}

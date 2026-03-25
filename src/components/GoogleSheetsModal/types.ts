export type EmbedMode = "view" | "edit";

export interface GoogleSheetsModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  mode?: EmbedMode;
  zIndex?: number;
}

export interface ModalInstance {
  id: string;
  url: string;
  title?: string;
  mode: EmbedMode;
  zIndex: number;
}

export type ModalAction =
  | { type: "OPEN_MODAL"; payload: Omit<ModalInstance, "zIndex"> }
  | { type: "CLOSE_MODAL"; payload: { id: string } }
  | { type: "CLOSE_ALL" }
  | { type: "BRING_TO_FRONT"; payload: { id: string } };

export interface ModalState {
  modals: ModalInstance[];
  nextZIndex: number;
}

export interface ModalManagerContextValue {
  modals: ModalInstance[];
  openSheet: (
    url: string,
    opts?: { title?: string; mode?: EmbedMode }
  ) => string;
  closeSheet: (id: string) => void;
  closeAll: () => void;
  bringToFront: (id: string) => void;
}

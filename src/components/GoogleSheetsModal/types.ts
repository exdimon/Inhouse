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

export {};

declare global {
  interface Window {
    miro: {
      on: (event: string, callback: () => void) => void;
      isAuthorized: () => Promise<boolean>;
      requestAuthorization: () => Promise<void>;
      board: {
        requestToken: () => void;
        experimental: {
          createMindmapNode: (root: any) => Promise<void>;
        };
      };
    };
  }
}
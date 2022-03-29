import {} from 'styled-components/cssprop';

import { LocalizerType } from '../ts/types/Util';
import { LibsignalProtocol } from '../../libtextsecure/libsignal-protocol';

import { Store } from 'redux';

import { ConversationCollection, ConversationModel } from './models/conversation';
import { ConversationType } from './state/ducks/conversations';

export interface LibTextsecure {
  messaging: boolean;
}

/*
We declare window stuff here instead of global.d.ts because we are importing other declarations.
If you import anything in global.d.ts, the type system won't work correctly.
*/

declare global {
  interface Window {
    CONSTANTS: any;
    Events: any;
    Lodash: any;
    SessionSnodeAPI: any;
    Session: any;
    StubAppDotNetApi: any;
    StringView: any;
    StubMessageAPI: any;
    Whisper: any;
    clearLocalData: any;
    clipboard: any;
    dcodeIO: any;
    getSettingValue: (id: string, comparisonValue?: any) => any;
    setSettingValue: (id: string, value: any) => void;

    i18n: LocalizerType;
    libsignal: LibsignalProtocol;
    log: any;
    sessionFeatureFlags: {
      useOnionRequests: boolean;
      useCallMessage: boolean;
    };
    SessionSnodeAPI: SessionSnodeAPI;
    onLogin: any;
    persistStore?: Persistor;
    restart: any;
    getSeedNodeList: () => Array<any> | undefined;
    setPassword: any;
    storage: any;
    textsecure: LibTextsecure;
    toggleMediaPermissions: () => Promise<void>;
    toggleCallMediaPermissionsTo: (enabled: boolean) => Promise<void>;
    getCallMediaPermissions: () => boolean;
    updateZoomFactor: () => boolean;
    toggleMenuBar: () => void;
    toggleSpellCheck: any;
    setTheme: (newTheme: string) => any;
    isDev?: () => boolean;
    userConfig: any;
    versionInfo: any;
    getConversations: () => ConversationCollection;
    readyForUpdates: () => void;
    drawAttention: () => void;
    MediaRecorder: any;

    platform: string;
    openFromNotification: (convoId: string) => void;
    getEnvironment: () => string;
    getNodeVersion: () => string;

    showWindow: () => void;
    setCallMediaPermissions: (val: boolean) => void;
    setMediaPermissions: (val: boolean) => void;
    askForMediaAccess: () => void;
    getMediaPermissions: () => boolean;
    nodeSetImmediate: any;
    globalOnlineStatus: boolean;

    getTitle: () => string;
    getVersion: () => string;
    setAutoHideMenuBar: (val: boolean) => void;
    setMenuBarVisibility: (val: boolean) => void;
    contextMenuShown: boolean;
    inboxStore?: Store;
    openConversationWithMessages: (args: {
      conversationKey: string;
      messageId: string | null;
    }) => Promise<void>;
    LokiPushNotificationServer: any;
    getGlobalOnlineStatus: () => boolean;
    confirmationDialog: any;
    callWorker: (fnName: string, ...args: any) => Promise<any>;
    setStartInTray: (val: boolean) => Promise<void>;
    getStartInTray: () => Promise<boolean>;
    libsession: any;
  }
}

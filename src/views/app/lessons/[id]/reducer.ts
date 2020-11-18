export type ReducerState = {
  activeVideoId: string;
  videoEnded: boolean;
};

/**
 * Reducer action types
 */
export const types = {
  SET_ACTIVE_VIDEO_ID: 'SET_ACTIVE_VIDEO_ID',
  SET_VIDEO_ENDED: 'SET_VIDEO_ENDED',
};

/**
 * Initial reducer state
 */
export const initialState: ReducerState = {
  activeVideoId: '',
  videoEnded: false,
};

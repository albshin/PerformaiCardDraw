/**
 * This file was automatically generated by json-schema-to-typescript. DO NOT MODIFY IT BY HAND.
 * Instead, modify `songs.schema.json` and run `yarn validate` to regenerate the SongData types
 * here as well as checking that the data files match.
 */

/**
 * An array of strings without any duplicate values
 */
export type UniqueStringArr = string[];

/**
 * Describes the shape of data that any individual json file under `src/songs` will conform to
 */
export interface GameData {
  /**
   * Describes unique configuration options for this game
   */
  meta: {
    /**
     * Unix timestamp of last update to this data file
     */
    lastUpdated: number;
    /**
     * List of all difficulty classes available
     */
    difficulties: {
      /**
       * A unique string key to identify this difficulty class
       */
      key: string;
      /**
       * A css color to use to visually define this difficulty class
       */
      color: string;
    }[];
    /**
     * List of song categories
     */
    categories: string[];
    /**
     * List of all special flags one might filter songs by
     */
    flags: string[];
    lvlMax: number;
  };
  /**
   * Defines the default configuration for this game
   */
  defaults: {
    categories: UniqueStringArr;
    difficulties: UniqueStringArr;
    flags: UniqueStringArr;
    lowerLvlBound: number;
    upperLvlBound: number;
  };
  /**
   * Set of localized values for display of any categories, difficulties, or flags
   */
  i18n: {
    [k: string]: I18NDict;
  };
  songs: Song[];
}
/**
 * Dictionary of localized strings
 */
export interface I18NDict {
  [k: string]:
    | string
    | {
        [k: string]: string;
      };
}
export interface Song {
  id?: string;
  flags?: UniqueStringArr;
  name: string;
  artist: string;
  artist_translation?: string;
  category: string;
  bpm?: string;
  name_translation?: string;
  search_hint?: string;
  charts: Chart[];
  jacket: string;
  folder?: string;
  remyLink?: string;
}
export interface Chart {
  flags?: UniqueStringArr;
  /**
   * e.g. expert/challenge
   */
  diffClass: string;
  lvl: number;
  step?: number;
  shock?: number;
  freeze?: number;
  jacket?: string;
  author?: string;
}

import './videojs-chapter-thumbnail.scss';

import {MenuButton, MENU_BUTTON_NAME} from './menu/menu-button';
import {TRACK_ID} from './track/text-track';

/**
 * @name Chapters Plugin
 * @description
 * Define chapters plugin by specifying a WebVTT spec.
 * http://dev.w3.org/html5/webvtt/
 *
 * Abide by the following:
 *
 * @example
 * WEBVTT
 *
 * 00:00:00.000 --> 00:10:00.000
 * {
 *     "title":"Introduction",
 *     "image":"http://www.example.com/example.jpg"
 * }
 *
 * @example
 * videojs('player_id', {
 *     plugins: {
 *         chapter_thumbnails: {
 *             label:    'English',
 *             language: 'en',
 *             src:      'chapters.vtt'
 *         }
 *     }
 * });
 *
 * videojs('player_id').chapter_thumbnails({
 *     label:    'English',
 *     language: 'en',
 *     src:      'chapters.vtt'
 * });
 *
 * @param {Object} player VideoJS player
 * @param {Object} options={}
 * @param {Object} [options.label=English]
 * @param {Object} [options.language=en]
 * @param {Object} options.src
 * @param {Object} [options.template]
 */

export default class ChapterThumbnails {
    constructor(player, options = {}) {
        const defaults = {
            label:    'English',
            language: 'en'
        };

        this.player = player;

        this.text_track = videojs.mergeOptions(defaults, options, {
            default: true,
            kind:    'metadata',
            id:      TRACK_ID
        });

        this.template = this.text_track.template;
    }

    addComponent() {
        let control_bar = this.player.getChild('controlBar');

        let menu_button = control_bar.getChild(MENU_BUTTON_NAME);

        // remove existing menu button
        if (menu_button != null) {
            control_bar.removeChild(menu_button);

            menu_button.dispose();
        }

        let text_track = this.addTextTrack();

        menu_button = new MenuButton(this.player, {
            name: MENU_BUTTON_NAME,
            template: this.template,
            text_track
        });

        control_bar.addChild(menu_button);
    }

    addTextTrack() {
        let current_text_track = this.player.textTracks().getTrackById(TRACK_ID);

        // remove existing track
        if (typeof current_text_track !== 'undefined') {
            this.player.removeRemoteTextTrack(current_text_track);
        }

        return this.player.addRemoteTextTrack(this.text_track);
    }
}

videojs.plugin('chapter_thumbnails', function chapter_thumbnails(options) {
    let chapter_thumbnail = new ChapterThumbnails(this, options);

    chapter_thumbnail.addComponent();
});

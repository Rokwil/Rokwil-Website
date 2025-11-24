// Icon Picker Component
// Provides a visual icon picker for Bootstrap Icons

// Comprehensive list of Bootstrap Icons (deduplicated and sorted)
const BOOTSTRAP_ICONS = [
    // Common & UI
    'bi-123', 'bi-alarm', 'bi-alarm-fill', 'bi-app', 'bi-app-indicator', 'bi-archive', 'bi-archive-fill',
    'bi-arrow-down', 'bi-arrow-left', 'bi-arrow-right', 'bi-arrow-up', 'bi-arrows-angle-contract',
    'bi-arrows-angle-expand', 'bi-arrows-move', 'bi-award', 'bi-award-fill', 'bi-badge', 'bi-badge-fill',
    'bi-bell', 'bi-bell-fill', 'bi-bell-slash', 'bi-bookmark', 'bi-bookmark-fill', 'bi-box', 'bi-box-arrow-in-down',
    'bi-box-arrow-in-right', 'bi-box-arrow-up', 'bi-briefcase', 'bi-briefcase-fill', 'bi-brightness-high',
    'bi-brightness-low', 'bi-building', 'bi-building-fill', 'bi-calendar', 'bi-calendar-check', 'bi-calendar-fill',
    'bi-camera', 'bi-camera-fill', 'bi-cart', 'bi-cart-fill', 'bi-chat', 'bi-chat-fill', 'bi-check', 'bi-check-circle',
    'bi-check-circle-fill', 'bi-check-square', 'bi-chevron-down', 'bi-chevron-left', 'bi-chevron-right',
    'bi-chevron-up', 'bi-circle', 'bi-circle-fill', 'bi-clock', 'bi-clock-fill', 'bi-cloud', 'bi-cloud-fill',
    'bi-code', 'bi-code-slash', 'bi-collection', 'bi-collection-fill', 'bi-compass', 'bi-compass-fill',
    'bi-cpu', 'bi-cpu-fill', 'bi-credit-card', 'bi-credit-card-fill', 'bi-cup', 'bi-cup-fill', 'bi-dash',
    'bi-dash-circle', 'bi-dash-square', 'bi-database', 'bi-database-fill', 'bi-diagram-3', 'bi-diagram-3-fill',
    'bi-diamond', 'bi-diamond-fill', 'bi-display', 'bi-display-fill', 'bi-download', 'bi-droplet', 'bi-droplet-fill',
    'bi-egg', 'bi-egg-fill', 'bi-envelope', 'bi-envelope-fill', 'bi-exclamation', 'bi-exclamation-circle',
    'bi-exclamation-triangle', 'bi-eye', 'bi-eye-fill', 'bi-eye-slash', 'bi-file', 'bi-file-earmark',
    'bi-file-earmark-fill', 'bi-file-earmark-text', 'bi-file-fill', 'bi-file-text', 'bi-files', 'bi-files-alt',
    'bi-film', 'bi-film-fill', 'bi-filter', 'bi-fingerprint', 'bi-flag', 'bi-flag-fill', 'bi-folder', 'bi-folder-fill',
    'bi-folder-open', 'bi-folder-open-fill', 'bi-gear', 'bi-gear-fill', 'bi-geo', 'bi-geo-alt', 'bi-geo-alt-fill',
    'bi-geo-fill', 'bi-gift', 'bi-gift-fill', 'bi-graph-down', 'bi-graph-up', 'bi-grid', 'bi-grid-3x3',
    'bi-hand-thumbs-down', 'bi-hand-thumbs-up', 'bi-heart', 'bi-heart-fill', 'bi-heart-pulse', 'bi-house',
    'bi-house-fill', 'bi-image', 'bi-image-fill', 'bi-images', 'bi-info', 'bi-info-circle', 'bi-info-circle-fill',
    'bi-key', 'bi-key-fill', 'bi-laptop', 'bi-laptop-fill', 'bi-lightbulb', 'bi-lightbulb-fill', 'bi-link',
    'bi-link-45deg', 'bi-list', 'bi-list-check', 'bi-list-ul', 'bi-lock', 'bi-lock-fill', 'bi-mailbox',
    'bi-mailbox2', 'bi-map', 'bi-map-fill', 'bi-megaphone', 'bi-megaphone-fill', 'bi-menu-button',
    'bi-menu-button-fill', 'bi-moon', 'bi-moon-fill', 'bi-music-note', 'bi-music-note-beamed', 'bi-palette',
    'bi-palette-fill', 'bi-paperclip', 'bi-pause', 'bi-pause-circle', 'bi-pause-fill', 'bi-pencil', 'bi-pencil-fill',
    'bi-pencil-square', 'bi-people', 'bi-people-fill', 'bi-person', 'bi-person-fill', 'bi-phone', 'bi-phone-fill',
    'bi-pin', 'bi-pin-fill', 'bi-play', 'bi-play-circle', 'bi-play-fill', 'bi-plus', 'bi-plus-circle',
    'bi-plus-lg', 'bi-plus-square', 'bi-printer', 'bi-printer-fill', 'bi-question', 'bi-question-circle',
    'bi-question-circle-fill', 'bi-quote', 'bi-recycle', 'bi-reply', 'bi-reply-fill', 'bi-save', 'bi-save-fill',
    'bi-search', 'bi-share', 'bi-share-fill', 'bi-shield', 'bi-shield-check', 'bi-shield-fill', 'bi-shield-lock',
    'bi-shield-shaded', 'bi-shield-slash', 'bi-shield-x', 'bi-sliders', 'bi-sliders2', 'bi-sort-down',
    'bi-sort-up', 'bi-speedometer', 'bi-speedometer2', 'bi-star', 'bi-star-fill', 'bi-star-half', 'bi-stop',
    'bi-stop-circle', 'bi-stop-fill', 'bi-sun', 'bi-sun-fill', 'bi-tablet', 'bi-tablet-fill', 'bi-tag',
    'bi-tag-fill', 'bi-telephone', 'bi-telephone-fill', 'bi-three-dots', 'bi-three-dots-vertical', 'bi-tools',
    'bi-trash', 'bi-trash-fill', 'bi-trophy', 'bi-trophy-fill', 'bi-truck', 'bi-truck-flatbed', 'bi-upload',
    'bi-wallet', 'bi-wallet-fill', 'bi-wifi', 'bi-wifi-off', 'bi-x', 'bi-x-circle', 'bi-x-circle-fill',
    'bi-x-lg', 'bi-x-square', 'bi-x-square-fill',
    
    // Industrial Icons
    'bi-activity', 'bi-airplane', 'bi-airplane-engines', 'bi-airplane-engines-fill', 'bi-airplane-fill',
    'bi-bank', 'bi-bank2', 'bi-bar-chart', 'bi-bar-chart-fill', 'bi-bar-chart-line', 'bi-bar-chart-line-fill',
    'bi-bar-chart-steps', 'bi-basket', 'bi-basket-fill', 'bi-basket2', 'bi-basket2-fill', 'bi-basket3',
    'bi-basket3-fill', 'bi-battery', 'bi-battery-charging', 'bi-battery-full', 'bi-battery-half',
    'bi-bezier', 'bi-bezier2', 'bi-bicycle', 'bi-binoculars', 'bi-binoculars-fill', 'bi-box-seam',
    'bi-box-seam-fill', 'bi-boxes', 'bi-broadcast', 'bi-broadcast-pin', 'bi-brush', 'bi-brush-fill',
    'bi-bucket', 'bi-bucket-fill', 'bi-bug', 'bi-bug-fill', 'bi-calculator', 'bi-calculator-fill',
    'bi-capsule', 'bi-capsule-pill', 'bi-car-front', 'bi-car-front-fill', 'bi-cart-check', 'bi-cart-check-fill',
    'bi-cart-dash', 'bi-cart-dash-fill', 'bi-cart-plus', 'bi-cart-plus-fill', 'bi-cart-x', 'bi-cart-x-fill',
    'bi-cash', 'bi-cash-coin', 'bi-cash-stack', 'bi-clipboard', 'bi-clipboard-check', 'bi-clipboard-check-fill',
    'bi-clipboard-data', 'bi-clipboard-data-fill', 'bi-clipboard-fill', 'bi-clipboard-heart', 'bi-clipboard-heart-fill',
    'bi-clipboard-minus', 'bi-clipboard-minus-fill', 'bi-clipboard-plus', 'bi-clipboard-plus-fill',
    'bi-clipboard-x', 'bi-clipboard-x-fill', 'bi-cone', 'bi-cone-striped', 'bi-cpu-fill', 'bi-diagram-2',
    'bi-diagram-2-fill', 'bi-easel', 'bi-easel-fill', 'bi-easel2', 'bi-easel2-fill', 'bi-easel3', 'bi-easel3-fill',
    'bi-fan', 'bi-fence', 'bi-file-earmark-bar-graph', 'bi-file-earmark-bar-graph-fill', 'bi-file-earmark-binary',
    'bi-file-earmark-binary-fill', 'bi-file-earmark-break', 'bi-file-earmark-break-fill', 'bi-file-earmark-code',
    'bi-file-earmark-code-fill', 'bi-file-earmark-diff', 'bi-file-earmark-diff-fill', 'bi-file-earmark-easel',
    'bi-file-earmark-easel-fill', 'bi-file-earmark-excel', 'bi-file-earmark-excel-fill', 'bi-file-earmark-image',
    'bi-file-earmark-image-fill', 'bi-file-earmark-lock', 'bi-file-earmark-lock-fill', 'bi-file-earmark-lock2',
    'bi-file-earmark-lock2-fill', 'bi-file-earmark-medical', 'bi-file-earmark-medical-fill', 'bi-file-earmark-minus',
    'bi-file-earmark-minus-fill', 'bi-file-earmark-music', 'bi-file-earmark-music-fill', 'bi-file-earmark-pdf',
    'bi-file-earmark-pdf-fill', 'bi-file-earmark-person', 'bi-file-earmark-person-fill', 'bi-file-earmark-play',
    'bi-file-earmark-play-fill', 'bi-file-earmark-plus', 'bi-file-earmark-plus-fill', 'bi-file-earmark-post',
    'bi-file-earmark-post-fill', 'bi-file-earmark-ppt', 'bi-file-earmark-ppt-fill', 'bi-file-earmark-richtext',
    'bi-file-earmark-richtext-fill', 'bi-file-earmark-ruled', 'bi-file-earmark-ruled-fill', 'bi-file-earmark-slides',
    'bi-file-earmark-slides-fill', 'bi-file-earmark-spreadsheet', 'bi-file-earmark-spreadsheet-fill',
    'bi-file-earmark-zip', 'bi-file-earmark-zip-fill', 'bi-fire', 'bi-fuel-pump', 'bi-fuel-pump-diesel',
    'bi-fuel-pump-diesel-fill', 'bi-fuel-pump-fill', 'bi-gear-wide', 'bi-gear-wide-connected', 'bi-gears',
    'bi-grid-1x2', 'bi-grid-1x2-fill', 'bi-hammer', 'bi-hdd', 'bi-hdd-fill', 'bi-hdd-network', 'bi-hdd-network-fill',
    'bi-hdd-rack', 'bi-hdd-rack-fill', 'bi-hdd-stack', 'bi-hdd-stack-fill', 'bi-hexagon', 'bi-hexagon-fill',
    'bi-hexagon-half', 'bi-hurricane', 'bi-industry', 'bi-layers', 'bi-layers-fill', 'bi-layers-half',
    'bi-magnet', 'bi-magnet-fill', 'bi-minecart', 'bi-minecart-loaded', 'bi-mortarboard', 'bi-mortarboard-fill',
    'bi-nut', 'bi-nut-fill', 'bi-octagon', 'bi-octagon-fill', 'bi-octagon-half', 'bi-pentagon', 'bi-pentagon-fill',
    'bi-pentagon-half', 'bi-pie-chart', 'bi-pie-chart-fill', 'bi-pin-map', 'bi-pin-map-fill', 'bi-plug',
    'bi-plug-fill', 'bi-power', 'bi-projector', 'bi-projector-fill', 'bi-puzzle', 'bi-puzzle-fill',
    'bi-radar', 'bi-robot', 'bi-router', 'bi-router-fill', 'bi-rulers', 'bi-scissors', 'bi-server',
    'bi-server-fill', 'bi-shop', 'bi-shop-window', 'bi-signpost', 'bi-signpost-2', 'bi-signpost-2-fill',
    'bi-signpost-fill', 'bi-signpost-split', 'bi-signpost-split-fill', 'bi-sim', 'bi-sim-fill', 'bi-sim-slash',
    'bi-sim-slash-fill', 'bi-slash-circle', 'bi-slash-circle-fill', 'bi-slash-square', 'bi-slash-square-fill',
    'bi-square', 'bi-square-fill', 'bi-square-half', 'bi-stack', 'bi-stack-overflow', 'bi-stack-overflow-fill',
    'bi-stapler', 'bi-stickies', 'bi-stickies-fill', 'bi-stopwatch', 'bi-stopwatch-fill', 'bi-subtract',
    'bi-suitcase', 'bi-suitcase-fill', 'bi-suitcase-lg', 'bi-suitcase-lg-fill', 'bi-suitcase2', 'bi-suitcase2-fill',
    'bi-toggles', 'bi-toggles2', 'bi-train-front', 'bi-train-front-fill', 'bi-train-front-tunnel',
    'bi-train-front-tunnel-fill', 'bi-truck-front', 'bi-truck-front-fill', 'bi-wrench', 'bi-wrench-adjustable',
    'bi-wrench-adjustable-circle', 'bi-wrench-adjustable-circle-fill', 'bi-wrench-adjustable-circle-fill',
    
    // Development & Construction
    'bi-bricks', 'bi-broadcast', 'bi-broadcast-pin', 'bi-brush', 'bi-brush-fill', 'bi-bucket', 'bi-bucket-fill',
    'bi-clipboard', 'bi-clipboard-check', 'bi-clipboard-check-fill', 'bi-clipboard-data', 'bi-clipboard-data-fill',
    'bi-clipboard-fill', 'bi-code-square', 'bi-code-square-fill', 'bi-cone', 'bi-cone-striped', 'bi-cpu',
    'bi-cpu-fill', 'bi-diagram-2', 'bi-diagram-2-fill', 'bi-diagram-3', 'bi-diagram-3-fill', 'bi-easel',
    'bi-easel-fill', 'bi-easel2', 'bi-easel2-fill', 'bi-easel3', 'bi-easel3-fill', 'bi-file-code',
    'bi-file-code-fill', 'bi-file-earmark-code', 'bi-file-earmark-code-fill', 'bi-file-earmark-diff',
    'bi-file-earmark-diff-fill', 'bi-file-earmark-easel', 'bi-file-earmark-easel-fill', 'bi-file-earmark-richtext',
    'bi-file-earmark-richtext-fill', 'bi-file-earmark-ruled', 'bi-file-earmark-ruled-fill', 'bi-file-earmark-slides',
    'bi-file-earmark-slides-fill', 'bi-file-earmark-spreadsheet', 'bi-file-earmark-spreadsheet-fill',
    'bi-file-earmark-zip', 'bi-file-earmark-zip-fill', 'bi-file-zip', 'bi-file-zip-fill', 'bi-funnel',
    'bi-funnel-fill', 'bi-git', 'bi-github', 'bi-grid-1x2', 'bi-grid-1x2-fill', 'bi-grid-3x2', 'bi-grid-3x2-fill',
    'bi-grid-3x3', 'bi-grid-3x3-gap', 'bi-grid-3x3-gap-fill', 'bi-hammer', 'bi-hexagon', 'bi-hexagon-fill',
    'bi-hexagon-half', 'bi-layers', 'bi-layers-fill', 'bi-layers-half', 'bi-mortarboard', 'bi-mortarboard-fill',
    'bi-nut', 'bi-nut-fill', 'bi-octagon', 'bi-octagon-fill', 'bi-octagon-half', 'bi-pentagon', 'bi-pentagon-fill',
    'bi-pentagon-half', 'bi-puzzle', 'bi-puzzle-fill', 'bi-rulers', 'bi-scissors', 'bi-server', 'bi-server-fill',
    'bi-signpost', 'bi-signpost-2', 'bi-signpost-2-fill', 'bi-signpost-fill', 'bi-signpost-split',
    'bi-signpost-split-fill', 'bi-square', 'bi-square-fill', 'bi-square-half', 'bi-stack', 'bi-stapler',
    'bi-toggles', 'bi-toggles2', 'bi-wrench', 'bi-wrench-adjustable', 'bi-wrench-adjustable-circle',
    'bi-wrench-adjustable-circle-fill',
    
    // Property & Real Estate
    'bi-bank', 'bi-bank2', 'bi-building-add', 'bi-building-check', 'bi-building-dash', 'bi-building-down',
    'bi-building-exclamation', 'bi-building-fill-add', 'bi-building-fill-check', 'bi-building-fill-dash',
    'bi-building-fill-down', 'bi-building-fill-exclamation', 'bi-building-fill-gear', 'bi-building-fill-slash',
    'bi-building-fill-up', 'bi-building-fill-x', 'bi-building-gear', 'bi-building-slash', 'bi-building-up',
    'bi-building-x', 'bi-buildings', 'bi-buildings-fill', 'bi-door-closed', 'bi-door-closed-fill',
    'bi-door-open', 'bi-door-open-fill', 'bi-house-add', 'bi-house-add-fill', 'bi-house-check', 'bi-house-check-fill',
    'bi-house-dash', 'bi-house-dash-fill', 'bi-house-door', 'bi-house-door-fill', 'bi-house-down', 'bi-house-down-fill',
    'bi-house-exclamation', 'bi-house-exclamation-fill', 'bi-house-fill', 'bi-house-gear', 'bi-house-gear-fill',
    'bi-house-heart', 'bi-house-heart-fill', 'bi-house-lock', 'bi-house-lock-fill', 'bi-house-slash',
    'bi-house-slash-fill', 'bi-house-up', 'bi-house-up-fill', 'bi-house-x', 'bi-house-x-fill', 'bi-houses',
    'bi-houses-fill', 'bi-key', 'bi-key-fill', 'bi-lock', 'bi-lock-fill', 'bi-map', 'bi-map-fill',
    'bi-pin-map', 'bi-pin-map-fill', 'bi-signpost', 'bi-signpost-2', 'bi-signpost-2-fill', 'bi-signpost-fill',
    'bi-signpost-split', 'bi-signpost-split-fill', 'bi-tree', 'bi-tree-fill', 'bi-window', 'bi-window-dash',
    'bi-window-desktop', 'bi-window-fullscreen', 'bi-window-split',
    
    // Growth & Analytics
    'bi-activity', 'bi-arrow-down-circle', 'bi-arrow-down-circle-fill', 'bi-arrow-down-left-circle',
    'bi-arrow-down-left-circle-fill', 'bi-arrow-down-left-square', 'bi-arrow-down-left-square-fill',
    'bi-arrow-down-right-circle', 'bi-arrow-down-right-circle-fill', 'bi-arrow-down-right-square',
    'bi-arrow-down-right-square-fill', 'bi-arrow-down-short', 'bi-arrow-down-square', 'bi-arrow-down-square-fill',
    'bi-arrow-down-up', 'bi-arrow-left-circle', 'bi-arrow-left-circle-fill', 'bi-arrow-left-right',
    'bi-arrow-left-short', 'bi-arrow-left-square', 'bi-arrow-left-square-fill', 'bi-arrow-repeat',
    'bi-arrow-return-left', 'bi-arrow-return-right', 'bi-arrow-right-circle', 'bi-arrow-right-circle-fill',
    'bi-arrow-right-short', 'bi-arrow-right-square', 'bi-arrow-right-square-fill', 'bi-arrow-up-circle',
    'bi-arrow-up-circle-fill', 'bi-arrow-up-left-circle', 'bi-arrow-up-left-circle-fill', 'bi-arrow-up-left-square',
    'bi-arrow-up-left-square-fill', 'bi-arrow-up-right-circle', 'bi-arrow-up-right-circle-fill',
    'bi-arrow-up-right-square', 'bi-arrow-up-right-square-fill', 'bi-arrow-up-short', 'bi-arrow-up-square',
    'bi-arrow-up-square-fill', 'bi-bar-chart', 'bi-bar-chart-fill', 'bi-bar-chart-line', 'bi-bar-chart-line-fill',
    'bi-bar-chart-steps', 'bi-cash', 'bi-cash-coin', 'bi-cash-stack', 'bi-chevron-bar-contract',
    'bi-chevron-bar-down', 'bi-chevron-bar-expand', 'bi-chevron-bar-left', 'bi-chevron-bar-right',
    'bi-chevron-bar-up', 'bi-chevron-compact-down', 'bi-chevron-compact-left', 'bi-chevron-compact-right',
    'bi-chevron-compact-up', 'bi-currency-bitcoin', 'bi-currency-dollar', 'bi-currency-euro', 'bi-currency-exchange',
    'bi-currency-pound', 'bi-currency-yen', 'bi-diagram-2', 'bi-diagram-2-fill', 'bi-diagram-3', 'bi-diagram-3-fill',
    'bi-file-earmark-bar-graph', 'bi-file-earmark-bar-graph-fill', 'bi-graph-down', 'bi-graph-down-arrow',
    'bi-graph-up', 'bi-graph-up-arrow', 'bi-pie-chart', 'bi-pie-chart-fill', 'bi-trending-down', 'bi-trending-up',
    
    // Aviation & Transportation
    'bi-airplane', 'bi-airplane-engines', 'bi-airplane-engines-fill', 'bi-airplane-fill', 'bi-bicycle',
    'bi-bus-front', 'bi-bus-front-fill', 'bi-car-front', 'bi-car-front-fill', 'bi-ev-front', 'bi-ev-front-fill',
    'bi-ev-station', 'bi-ev-station-fill', 'bi-fuel-pump', 'bi-fuel-pump-diesel', 'bi-fuel-pump-diesel-fill',
    'bi-fuel-pump-fill', 'bi-scooter', 'bi-sign-stop', 'bi-sign-stop-fill', 'bi-sign-stop-lights',
    'bi-sign-stop-lights-fill', 'bi-sign-yield', 'bi-sign-yield-fill', 'bi-train-front', 'bi-train-front-fill',
    'bi-train-front-tunnel', 'bi-train-front-tunnel-fill', 'bi-truck', 'bi-truck-front', 'bi-truck-front-fill',
    'bi-truck-flatbed', 'bi-truck-flatbed-fill', 'bi-truck-front', 'bi-truck-front-fill', 'bi-truck-front-tunnel',
    'bi-truck-front-tunnel-fill', 'bi-truck-front-tunnel-fill',
    
    // Additional Useful Icons
    'bi-arrow-through-heart', 'bi-arrow-through-heart-fill', 'bi-bag', 'bi-bag-check', 'bi-bag-check-fill',
    'bi-bag-dash', 'bi-bag-dash-fill', 'bi-bag-fill', 'bi-bag-heart', 'bi-bag-heart-fill', 'bi-bag-plus',
    'bi-bag-plus-fill', 'bi-bag-x', 'bi-bag-x-fill', 'bi-bank', 'bi-bank2', 'bi-basket', 'bi-basket-fill',
    'bi-basket2', 'bi-basket2-fill', 'bi-basket3', 'bi-basket3-fill', 'bi-bezier', 'bi-bezier2', 'bi-binoculars',
    'bi-binoculars-fill', 'bi-book', 'bi-book-fill', 'bi-book-half', 'bi-bookmark-check', 'bi-bookmark-check-fill',
    'bi-bookmark-dash', 'bi-bookmark-dash-fill', 'bi-bookmark-heart', 'bi-bookmark-heart-fill', 'bi-bookmark-plus',
    'bi-bookmark-plus-fill', 'bi-bookmark-star', 'bi-bookmark-star-fill', 'bi-bookmark-x', 'bi-bookmark-x-fill',
    'bi-bookshelf', 'bi-bootstrap', 'bi-bootstrap-fill', 'bi-bootstrap-reboot', 'bi-bounding-box',
    'bi-bounding-box-circles', 'bi-box-arrow-down', 'bi-box-arrow-down-left', 'bi-box-arrow-down-right',
    'bi-box-arrow-in-down', 'bi-box-arrow-in-down-left', 'bi-box-arrow-in-down-right', 'bi-box-arrow-in-left',
    'bi-box-arrow-in-right', 'bi-box-arrow-in-up', 'bi-box-arrow-in-up-left', 'bi-box-arrow-in-up-right',
    'bi-box-arrow-left', 'bi-box-arrow-right', 'bi-box-arrow-up', 'bi-box-arrow-up-left', 'bi-box-arrow-up-right',
    'bi-box-seam', 'bi-box-seam-fill', 'bi-boxes', 'bi-braces', 'bi-braces-asterisk', 'bi-bricks', 'bi-broadcast',
    'bi-broadcast-pin', 'bi-brush', 'bi-brush-fill', 'bi-bucket', 'bi-bucket-fill', 'bi-bug', 'bi-bug-fill',
    'bi-calculator', 'bi-calculator-fill', 'bi-calendar-day', 'bi-calendar-day-fill', 'bi-calendar-event',
    'bi-calendar-event-fill', 'bi-calendar-heart', 'bi-calendar-heart-fill', 'bi-calendar-minus', 'bi-calendar-minus-fill',
    'bi-calendar-plus', 'bi-calendar-plus-fill', 'bi-calendar-range', 'bi-calendar-range-fill', 'bi-calendar-week',
    'bi-calendar-week-fill', 'bi-calendar-x', 'bi-calendar-x-fill', 'bi-calendar2', 'bi-calendar2-check',
    'bi-calendar2-check-fill', 'bi-calendar2-day', 'bi-calendar2-day-fill', 'bi-calendar2-event', 'bi-calendar2-event-fill',
    'bi-calendar2-heart', 'bi-calendar2-heart-fill', 'bi-calendar2-minus', 'bi-calendar2-minus-fill', 'bi-calendar2-plus',
    'bi-calendar2-plus-fill', 'bi-calendar2-range', 'bi-calendar2-range-fill', 'bi-calendar2-week', 'bi-calendar2-week-fill',
    'bi-calendar2-x', 'bi-calendar2-x-fill', 'bi-calendar3', 'bi-calendar3-event', 'bi-calendar3-event-fill',
    'bi-calendar3-fill', 'bi-calendar3-range', 'bi-calendar3-range-fill', 'bi-calendar4', 'bi-calendar4-event',
    'bi-calendar4-range', 'bi-calendar4-week', 'bi-camera-reels', 'bi-camera-reels-fill', 'bi-camera-video',
    'bi-camera-video-fill', 'bi-camera-video-off', 'bi-camera-video-off-fill', 'bi-capsule', 'bi-capsule-pill',
    'bi-card-checklist', 'bi-card-heading', 'bi-card-image', 'bi-card-list', 'bi-card-text', 'bi-caret-down',
    'bi-caret-down-fill', 'bi-caret-left', 'bi-caret-left-fill', 'bi-caret-right', 'bi-caret-right-fill',
    'bi-caret-up', 'bi-caret-up-fill', 'bi-cart-check', 'bi-cart-check-fill', 'bi-cart-dash', 'bi-cart-dash-fill',
    'bi-cart-plus', 'bi-cart-plus-fill', 'bi-cart-x', 'bi-cart-x-fill', 'bi-cash', 'bi-cash-coin', 'bi-cash-stack',
    'bi-cast', 'bi-cc-circle', 'bi-cc-circle-fill', 'bi-cc-square', 'bi-cc-square-fill', 'bi-chat-dots', 'bi-chat-dots-fill',
    'bi-chat-left', 'bi-chat-left-dots', 'bi-chat-left-dots-fill', 'bi-chat-left-fill', 'bi-chat-left-heart',
    'bi-chat-left-heart-fill', 'bi-chat-left-quote', 'bi-chat-left-quote-fill', 'bi-chat-left-text', 'bi-chat-left-text-fill',
    'bi-chat-quote', 'bi-chat-quote-fill', 'bi-chat-right', 'bi-chat-right-dots', 'bi-chat-right-dots-fill',
    'bi-chat-right-fill', 'bi-chat-right-heart', 'bi-chat-right-heart-fill', 'bi-chat-right-quote',
    'bi-chat-right-quote-fill', 'bi-chat-right-text', 'bi-chat-right-text-fill', 'bi-chat-square', 'bi-chat-square-dots',
    'bi-chat-square-dots-fill', 'bi-chat-square-fill', 'bi-chat-square-heart', 'bi-chat-square-heart-fill',
    'bi-chat-square-quote', 'bi-chat-square-quote-fill', 'bi-chat-square-text', 'bi-chat-square-text-fill',
    'bi-chat-text', 'bi-chat-text-fill', 'bi-check-all', 'bi-check-lg', 'bi-check2', 'bi-check2-all', 'bi-check2-circle',
    'bi-check2-square', 'bi-chevron-double-down', 'bi-chevron-double-left', 'bi-chevron-double-right',
    'bi-chevron-double-up', 'bi-circle-fill', 'bi-circle-half', 'bi-clipboard', 'bi-clipboard-check',
    'bi-clipboard-check-fill', 'bi-clipboard-data', 'bi-clipboard-data-fill', 'bi-clipboard-fill', 'bi-clipboard-heart',
    'bi-clipboard-heart-fill', 'bi-clipboard-minus', 'bi-clipboard-minus-fill', 'bi-clipboard-plus',
    'bi-clipboard-plus-fill', 'bi-clipboard-x', 'bi-clipboard-x-fill', 'bi-clock-history', 'bi-cloud-arrow-down',
    'bi-cloud-arrow-down-fill', 'bi-cloud-arrow-up', 'bi-cloud-arrow-up-fill', 'bi-cloud-check', 'bi-cloud-check-fill',
    'bi-cloud-download', 'bi-cloud-download-fill', 'bi-cloud-drizzle', 'bi-cloud-drizzle-fill', 'bi-cloud-fog',
    'bi-cloud-fog-fill', 'bi-cloud-fog2', 'bi-cloud-fog2-fill', 'bi-cloud-hail', 'bi-cloud-hail-fill',
    'bi-cloud-haze', 'bi-cloud-haze-fill', 'bi-cloud-haze2', 'bi-cloud-haze2-fill', 'bi-cloud-lightning',
    'bi-cloud-lightning-fill', 'bi-cloud-lightning-rain', 'bi-cloud-lightning-rain-fill', 'bi-cloud-minus',
    'bi-cloud-minus-fill', 'bi-cloud-plus', 'bi-cloud-plus-fill', 'bi-cloud-rain', 'bi-cloud-rain-fill',
    'bi-cloud-rain-heavy', 'bi-cloud-rain-heavy-fill', 'bi-cloud-slash', 'bi-cloud-slash-fill', 'bi-cloud-sleet',
    'bi-cloud-sleet-fill', 'bi-cloud-snow', 'bi-cloud-snow-fill', 'bi-cloud-sun', 'bi-cloud-sun-fill',
    'bi-cloud-upload', 'bi-cloud-upload-fill', 'bi-clouds', 'bi-clouds-fill', 'bi-cloudy', 'bi-cloudy-fill',
    'bi-code-square', 'bi-code-square-fill', 'bi-collection-play', 'bi-collection-play-fill', 'bi-command',
    'bi-compass-fill', 'bi-cone', 'bi-cone-striped', 'bi-controller', 'bi-cpu-fill', 'bi-crop', 'bi-crosshair',
    'bi-crosshair2', 'bi-cup-hot', 'bi-cup-hot-fill', 'bi-cup-straw', 'bi-cup-straw-fill', 'bi-currency-bitcoin',
    'bi-currency-dollar', 'bi-currency-euro', 'bi-currency-exchange', 'bi-currency-pound', 'bi-currency-yen',
    'bi-cursor', 'bi-cursor-fill', 'bi-cursor-text', 'bi-dash-lg', 'bi-database-add', 'bi-database-check',
    'bi-database-dash', 'bi-database-down', 'bi-database-exclamation', 'bi-database-fill-add', 'bi-database-fill-check',
    'bi-database-fill-dash', 'bi-database-fill-down', 'bi-database-fill-exclamation', 'bi-database-fill-gear',
    'bi-database-fill-lock', 'bi-database-fill-slash', 'bi-database-fill-up', 'bi-database-fill-x', 'bi-database-gear',
    'bi-database-lock', 'bi-database-slash', 'bi-database-up', 'bi-database-x', 'bi-device-hdd', 'bi-device-hdd-fill',
    'bi-device-ssd', 'bi-device-ssd-fill', 'bi-diagram-2', 'bi-diagram-2-fill', 'bi-diagram-3', 'bi-diagram-3-fill',
    'bi-diamond-half', 'bi-dice-1', 'bi-dice-1-fill', 'bi-dice-2', 'bi-dice-2-fill', 'bi-dice-3', 'bi-dice-3-fill',
    'bi-dice-4', 'bi-dice-4-fill', 'bi-dice-5', 'bi-dice-5-fill', 'bi-dice-6', 'bi-dice-6-fill', 'bi-disc',
    'bi-disc-fill', 'bi-discord', 'bi-displayport', 'bi-displayport-fill', 'bi-distribute-horizontal',
    'bi-distribute-vertical', 'bi-door-closed', 'bi-door-closed-fill', 'bi-door-open', 'bi-door-open-fill',
    'bi-dot', 'bi-download', 'bi-dribbble', 'bi-droplet-half', 'bi-earbuds', 'bi-easel', 'bi-easel-fill',
    'bi-easel2', 'bi-easel2-fill', 'bi-easel3', 'bi-easel3-fill', 'bi-egg-fried', 'bi-eject', 'bi-eject-fill',
    'bi-emoji-angry', 'bi-emoji-angry-fill', 'bi-emoji-dizzy', 'bi-emoji-dizzy-fill', 'bi-emoji-expressionless',
    'bi-emoji-expressionless-fill', 'bi-emoji-frown', 'bi-emoji-frown-fill', 'bi-emoji-heart-eyes',
    'bi-emoji-heart-eyes-fill', 'bi-emoji-kiss', 'bi-emoji-kiss-fill', 'bi-emoji-laughing', 'bi-emoji-laughing-fill',
    'bi-emoji-neutral', 'bi-emoji-neutral-fill', 'bi-emoji-smile', 'bi-emoji-smile-fill', 'bi-emoji-smile-upside-down',
    'bi-emoji-smile-upside-down-fill', 'bi-emoji-sunglasses', 'bi-emoji-sunglasses-fill', 'bi-emoji-wink',
    'bi-emoji-wink-fill', 'bi-envelope-at', 'bi-envelope-at-fill', 'bi-envelope-check', 'bi-envelope-check-fill',
    'bi-envelope-dash', 'bi-envelope-dash-fill', 'bi-envelope-exclamation', 'bi-envelope-exclamation-fill',
    'bi-envelope-heart', 'bi-envelope-heart-fill', 'bi-envelope-open', 'bi-envelope-open-fill', 'bi-envelope-paper',
    'bi-envelope-paper-fill', 'bi-envelope-paper-heart', 'bi-envelope-paper-heart-fill', 'bi-envelope-plus',
    'bi-envelope-plus-fill', 'bi-envelope-slash', 'bi-envelope-slash-fill', 'bi-envelope-x', 'bi-envelope-x-fill',
    'bi-eraser', 'bi-eraser-fill', 'bi-ethernet', 'bi-ev-front', 'bi-ev-front-fill', 'bi-ev-station', 'bi-ev-station-fill',
    'bi-exclamation-diamond', 'bi-exclamation-diamond-fill', 'bi-exclamation-lg', 'bi-exclamation-octagon',
    'bi-exclamation-octagon-fill', 'bi-exclamation-square', 'bi-exclamation-square-fill', 'bi-exclamation-triangle-fill',
    'bi-eye-slash-fill', 'bi-facebook', 'bi-fan', 'bi-fast-forward', 'bi-fast-forward-btn', 'bi-fast-forward-btn-fill',
    'bi-fast-forward-circle', 'bi-fast-forward-circle-fill', 'bi-fast-forward-fill', 'bi-file-arrow-down',
    'bi-file-arrow-down-fill', 'bi-file-arrow-up', 'bi-file-arrow-up-fill', 'bi-file-bar-graph', 'bi-file-bar-graph-fill',
    'bi-file-binary', 'bi-file-binary-fill', 'bi-file-break', 'bi-file-break-fill', 'bi-file-check', 'bi-file-check-fill',
    'bi-file-code', 'bi-file-code-fill', 'bi-file-diff', 'bi-file-diff-fill', 'bi-file-earmark-arrow-down',
    'bi-file-earmark-arrow-down-fill', 'bi-file-earmark-arrow-up', 'bi-file-earmark-arrow-up-fill', 'bi-file-earmark-bar-graph',
    'bi-file-earmark-bar-graph-fill', 'bi-file-earmark-binary', 'bi-file-earmark-binary-fill', 'bi-file-earmark-break',
    'bi-file-earmark-break-fill', 'bi-file-earmark-check', 'bi-file-earmark-check-fill', 'bi-file-earmark-code',
    'bi-file-earmark-code-fill', 'bi-file-earmark-diff', 'bi-file-earmark-diff-fill', 'bi-file-earmark-easel',
    'bi-file-earmark-easel-fill', 'bi-file-earmark-excel', 'bi-file-earmark-excel-fill', 'bi-file-earmark-image',
    'bi-file-earmark-image-fill', 'bi-file-earmark-lock', 'bi-file-earmark-lock-fill', 'bi-file-earmark-lock2',
    'bi-file-earmark-lock2-fill', 'bi-file-earmark-medical', 'bi-file-earmark-medical-fill', 'bi-file-earmark-minus',
    'bi-file-earmark-minus-fill', 'bi-file-earmark-music', 'bi-file-earmark-music-fill', 'bi-file-earmark-pdf',
    'bi-file-earmark-pdf-fill', 'bi-file-earmark-person', 'bi-file-earmark-person-fill', 'bi-file-earmark-play',
    'bi-file-earmark-play-fill', 'bi-file-earmark-plus', 'bi-file-earmark-plus-fill', 'bi-file-earmark-post',
    'bi-file-earmark-post-fill', 'bi-file-earmark-ppt', 'bi-file-earmark-ppt-fill', 'bi-file-earmark-richtext',
    'bi-file-earmark-richtext-fill', 'bi-file-earmark-ruled', 'bi-file-earmark-ruled-fill', 'bi-file-earmark-slides',
    'bi-file-earmark-slides-fill', 'bi-file-earmark-spreadsheet', 'bi-file-earmark-spreadsheet-fill', 'bi-file-earmark-zip',
    'bi-file-earmark-zip-fill', 'bi-file-easel', 'bi-file-easel-fill', 'bi-file-excel', 'bi-file-excel-fill',
    'bi-file-image', 'bi-file-image-fill', 'bi-file-lock', 'bi-file-lock-fill', 'bi-file-lock2', 'bi-file-lock2-fill',
    'bi-file-medical', 'bi-file-medical-fill', 'bi-file-minus', 'bi-file-minus-fill', 'bi-file-music', 'bi-file-music-fill',
    'bi-file-pdf', 'bi-file-pdf-fill', 'bi-file-person', 'bi-file-person-fill', 'bi-file-play', 'bi-file-play-fill',
    'bi-file-plus', 'bi-file-plus-fill', 'bi-file-post', 'bi-file-post-fill', 'bi-file-ppt', 'bi-file-ppt-fill',
    'bi-file-richtext', 'bi-file-richtext-fill', 'bi-file-ruled', 'bi-file-ruled-fill', 'bi-file-slides', 'bi-file-slides-fill',
    'bi-file-spreadsheet', 'bi-file-spreadsheet-fill', 'bi-file-zip', 'bi-file-zip-fill', 'bi-files-alt', 'bi-fire',
    'bi-flag-fill', 'bi-flag-fill', 'bi-flower1', 'bi-flower2', 'bi-flower3', 'bi-folder-check', 'bi-folder-check-fill',
    'bi-folder-minus', 'bi-folder-minus-fill', 'bi-folder-plus', 'bi-folder-plus-fill', 'bi-folder-symlink',
    'bi-folder-symlink-fill', 'bi-folder-x', 'bi-folder-x-fill', 'bi-folder2', 'bi-folder2-open', 'bi-forward',
    'bi-forward-fill', 'bi-front', 'bi-front-fill', 'bi-fuel-pump', 'bi-fuel-pump-diesel', 'bi-fuel-pump-diesel-fill',
    'bi-fuel-pump-fill', 'bi-funnel', 'bi-funnel-fill', 'bi-gear-fill', 'bi-gear-wide', 'bi-gear-wide-connected',
    'bi-gears', 'bi-gem', 'bi-gender-ambiguous', 'bi-gender-female', 'bi-gender-male', 'bi-gender-neuter',
    'bi-gender-trans', 'bi-geo-alt', 'bi-geo-alt-fill', 'bi-geo-fill', 'bi-gift-fill', 'bi-git', 'bi-github',
    'bi-globe', 'bi-globe-americas', 'bi-globe-americas-fill', 'bi-globe-asia-australia', 'bi-globe-asia-australia-fill',
    'bi-globe-central-south-asia', 'bi-globe-central-south-asia-fill', 'bi-globe-europe-africa', 'bi-globe-europe-africa-fill',
    'bi-globe-fill', 'bi-globe2', 'bi-google', 'bi-google-play', 'bi-gpu-card', 'bi-graph-down', 'bi-graph-down-arrow',
    'bi-graph-up', 'bi-graph-up-arrow', 'bi-grid-1x2', 'bi-grid-1x2-fill', 'bi-grid-3x2', 'bi-grid-3x2-fill',
    'bi-grid-3x3', 'bi-grid-3x3-gap', 'bi-grid-3x3-gap-fill', 'bi-hammer', 'bi-hand-index', 'bi-hand-index-fill',
    'bi-hand-index-thumb', 'bi-hand-index-thumb-fill', 'bi-hand-thumbs-down-fill', 'bi-hand-thumbs-up-fill',
    'bi-hdd', 'bi-hdd-fill', 'bi-hdd-network', 'bi-hdd-network-fill', 'bi-hdd-rack', 'bi-hdd-rack-fill',
    'bi-hdd-stack', 'bi-hdd-stack-fill', 'bi-hdmi', 'bi-hdmi-fill', 'bi-headphones', 'bi-headset', 'bi-headset-vr',
    'bi-heart-arrow', 'bi-heart-fill', 'bi-heart-pulse-fill', 'bi-heartbreak', 'bi-heartbreak-fill', 'bi-hearts',
    'bi-hexagon', 'bi-hexagon-fill', 'bi-hexagon-half', 'bi-hospital', 'bi-hospital-fill', 'bi-hourglass',
    'bi-hourglass-bottom', 'bi-hourglass-split', 'bi-hourglass-top', 'bi-house-add', 'bi-house-add-fill',
    'bi-house-check', 'bi-house-check-fill', 'bi-house-dash', 'bi-house-dash-fill', 'bi-house-door', 'bi-house-door-fill',
    'bi-house-down', 'bi-house-down-fill', 'bi-house-exclamation', 'bi-house-exclamation-fill', 'bi-house-fill',
    'bi-house-gear', 'bi-house-gear-fill', 'bi-house-heart', 'bi-house-heart-fill', 'bi-house-lock', 'bi-house-lock-fill',
    'bi-house-slash', 'bi-house-slash-fill', 'bi-house-up', 'bi-house-up-fill', 'bi-house-x', 'bi-house-x-fill',
    'bi-houses', 'bi-houses-fill', 'bi-hr', 'bi-hurricane', 'bi-hypnotize', 'bi-image-alt', 'bi-inbox', 'bi-inbox-fill',
    'bi-inboxes', 'bi-inboxes-fill', 'bi-incognito', 'bi-industry', 'bi-infinity', 'bi-info-lg', 'bi-input-cursor',
    'bi-input-cursor-text', 'bi-instagram', 'bi-intersect', 'bi-journal', 'bi-journal-album', 'bi-journal-album-fill',
    'bi-journal-arrow-down', 'bi-journal-arrow-down-fill', 'bi-journal-arrow-up', 'bi-journal-arrow-up-fill',
    'bi-journal-bookmark', 'bi-journal-bookmark-fill', 'bi-journal-check', 'bi-journal-check-fill', 'bi-journal-code',
    'bi-journal-code-fill', 'bi-journal-medical', 'bi-journal-medical-fill', 'bi-journal-minus', 'bi-journal-minus-fill',
    'bi-journal-plus', 'bi-journal-plus-fill', 'bi-journal-richtext', 'bi-journal-richtext-fill', 'bi-journal-text',
    'bi-journal-text-fill', 'bi-journal-x', 'bi-journal-x-fill', 'bi-journals', 'bi-journals-fill', 'bi-joystick',
    'bi-justify', 'bi-justify-left', 'bi-justify-right', 'bi-kanban', 'bi-kanban-fill', 'bi-key-fill', 'bi-keyboard',
    'bi-keyboard-fill', 'bi-ladder', 'bi-lamp', 'bi-lamp-fill', 'bi-laptop-fill', 'bi-layer-backward', 'bi-layer-forward',
    'bi-layers', 'bi-layers-fill', 'bi-layers-half', 'bi-layout-sidebar', 'bi-layout-sidebar-inset-reverse',
    'bi-layout-sidebar-inset-reverse-fill', 'bi-layout-sidebar-reverse', 'bi-layout-split', 'bi-layout-text-sidebar',
    'bi-layout-text-sidebar-reverse', 'bi-layout-text-window', 'bi-layout-text-window-reverse', 'bi-layout-three-columns',
    'bi-layout-wtf', 'bi-life-preserver', 'bi-lightbulb-fill', 'bi-lightbulb-off', 'bi-lightbulb-off-fill',
    'bi-lightning', 'bi-lightning-charge', 'bi-lightning-charge-fill', 'bi-lightning-fill', 'bi-line', 'bi-link-45deg',
    'bi-linkedin', 'bi-list-check', 'bi-list-nested', 'bi-list-ol', 'bi-list-stars', 'bi-list-task', 'bi-list-ul',
    'bi-lock-fill', 'bi-luggage', 'bi-luggage-fill', 'bi-lungs', 'bi-lungs-fill', 'bi-magic', 'bi-mailbox-flag',
    'bi-mailbox2-flag', 'bi-map-fill', 'bi-markdown', 'bi-markdown-fill', 'bi-mastodon', 'bi-medium', 'bi-memory',
    'bi-menu-app', 'bi-menu-app-fill', 'bi-menu-button-fill', 'bi-menu-button-wide', 'bi-menu-button-wide-fill',
    'bi-menu-down', 'bi-menu-up', 'bi-messenger', 'bi-meta', 'bi-mic', 'bi-mic-fill', 'bi-mic-mute', 'bi-mic-mute-fill',
    'bi-microsoft', 'bi-microsoft-teams', 'bi-minecart', 'bi-minecart-loaded', 'bi-modem', 'bi-modem-fill',
    'bi-mortarboard', 'bi-mortarboard-fill', 'bi-mortarboard-fill', 'bi-motherboard', 'bi-motherboard-fill',
    'bi-mouse', 'bi-mouse-fill', 'bi-mouse2', 'bi-mouse2-fill', 'bi-mouse3', 'bi-mouse3-fill', 'bi-music-note-beamed',
    'bi-music-note-list', 'bi-music-player', 'bi-music-player-fill', 'bi-newspaper', 'bi-nintendo-switch',
    'bi-node-minus', 'bi-node-minus-fill', 'bi-node-plus', 'bi-node-plus-fill', 'bi-nut', 'bi-nut-fill',
    'bi-octagon', 'bi-octagon-fill', 'bi-octagon-half', 'bi-opencollective', 'bi-option', 'bi-outlet', 'bi-paint-bucket',
    'bi-palette-fill', 'bi-palette2', 'bi-paperclip', 'bi-paragraph', 'bi-pass', 'bi-pass-fill', 'bi-patch-check',
    'bi-patch-check-fill', 'bi-patch-exclamation', 'bi-patch-exclamation-fill', 'bi-patch-minus', 'bi-patch-minus-fill',
    'bi-patch-plus', 'bi-patch-plus-fill', 'bi-patch-question', 'bi-patch-question-fill', 'bi-pause-btn', 'bi-pause-btn-fill',
    'bi-pause-circle-fill', 'bi-pause-fill', 'bi-paypal', 'bi-pc', 'bi-pc-display', 'bi-pc-display-horizontal',
    'bi-pc-horizontal', 'bi-pci-card', 'bi-peace', 'bi-peace-fill', 'bi-pen', 'bi-pencil-fill', 'bi-pencil-square-fill',
    'bi-pentagon', 'bi-pentagon-fill', 'bi-pentagon-half', 'bi-people-fill', 'bi-percent', 'bi-person-add',
    'bi-person-add-fill', 'bi-person-badge', 'bi-person-badge-fill', 'bi-person-bounding-box', 'bi-person-check',
    'bi-person-check-fill', 'bi-person-dash', 'bi-person-dash-fill', 'bi-person-down', 'bi-person-down-fill',
    'bi-person-exclamation', 'bi-person-exclamation-fill', 'bi-person-fill', 'bi-person-fill-add', 'bi-person-fill-check',
    'bi-person-fill-dash', 'bi-person-fill-down', 'bi-person-fill-exclamation', 'bi-person-fill-gear',
    'bi-person-fill-gear', 'bi-person-fill-lock', 'bi-person-fill-slash', 'bi-person-fill-up', 'bi-person-fill-x',
    'bi-person-gear', 'bi-person-heart', 'bi-person-heart-fill', 'bi-person-hearts', 'bi-person-lines-fill',
    'bi-person-lock', 'bi-person-lock-fill', 'bi-person-plus', 'bi-person-plus-fill', 'bi-person-rolodex',
    'bi-person-rolodex-fill', 'bi-person-slash', 'bi-person-slash-fill', 'bi-person-square', 'bi-person-square-fill',
    'bi-person-up', 'bi-person-up-fill', 'bi-person-vcard', 'bi-person-vcard-fill', 'bi-person-video', 'bi-person-video-fill',
    'bi-person-video2', 'bi-person-video2-fill', 'bi-person-video3', 'bi-person-video3-fill', 'bi-person-workspace',
    'bi-person-workspace-fill', 'bi-person-x', 'bi-person-x-fill', 'bi-phone-fill', 'bi-phone-flip', 'bi-phone-landscape',
    'bi-phone-landscape-fill', 'bi-phone-vibrate', 'bi-phone-vibrate-fill', 'bi-pie-chart', 'bi-pie-chart-fill',
    'bi-piggy-bank', 'bi-piggy-bank-fill', 'bi-pin-angle', 'bi-pin-angle-fill', 'bi-pin-fill', 'bi-pin-map',
    'bi-pin-map-fill', 'bi-pinterest', 'bi-pip', 'bi-pip-fill', 'bi-play-btn', 'bi-play-btn-fill', 'bi-play-circle-fill',
    'bi-play-fill', 'bi-playstation', 'bi-plug-fill', 'bi-plugin', 'bi-plus-circle-fill', 'bi-plus-lg', 'bi-plus-square-fill',
    'bi-postage', 'bi-postage-fill', 'bi-postage-heart', 'bi-postage-heart-fill', 'bi-postcard', 'bi-postcard-fill',
    'bi-postcard-heart', 'bi-postcard-heart-fill', 'bi-power', 'bi-prescription', 'bi-prescription2', 'bi-printer-fill',
    'bi-projector', 'bi-projector-fill', 'bi-puzzle', 'bi-puzzle-fill', 'bi-qr-code', 'bi-qr-code-scan',
    'bi-question-circle-fill', 'bi-question-diamond', 'bi-question-diamond-fill', 'bi-question-lg', 'bi-question-octagon',
    'bi-question-octagon-fill', 'bi-question-square', 'bi-question-square-fill', 'bi-quote', 'bi-radar', 'bi-radioactive',
    'bi-rainbow', 'bi-receipt', 'bi-receipt-cutoff', 'bi-reception-0', 'bi-reception-1', 'bi-reception-2',
    'bi-reception-3', 'bi-reception-4', 'bi-record', 'bi-record-btn', 'bi-record-btn-fill', 'bi-record-circle',
    'bi-record-circle-fill', 'bi-record-fill', 'bi-record2', 'bi-record2-fill', 'bi-recycle', 'bi-reddit',
    'bi-regex', 'bi-repeat', 'bi-repeat-1', 'bi-reply-all', 'bi-reply-all-fill', 'bi-reply-fill', 'bi-robot',
    'bi-router', 'bi-router-fill', 'bi-rss', 'bi-rss-fill', 'bi-rulers', 'bi-safe', 'bi-safe-fill', 'bi-safe2',
    'bi-safe2-fill', 'bi-save-fill', 'bi-save2', 'bi-save2-fill', 'bi-save2-fill', 'bi-scissors', 'bi-scooter',
    'bi-screwdriver', 'bi-sd-card', 'bi-sd-card-fill', 'bi-search-heart', 'bi-search-heart-fill', 'bi-segmented-nav',
    'bi-send', 'bi-send-check', 'bi-send-check-fill', 'bi-send-dash', 'bi-send-dash-fill', 'bi-send-exclamation',
    'bi-send-exclamation-fill', 'bi-send-fill', 'bi-send-plus', 'bi-send-plus-fill', 'bi-send-slash', 'bi-send-slash-fill',
    'bi-send-x', 'bi-send-x-fill', 'bi-server-fill', 'bi-share-fill', 'bi-shield-check', 'bi-shield-exclamation',
    'bi-shield-exclamation-fill', 'bi-shield-fill-check', 'bi-shield-fill-exclamation', 'bi-shield-fill-minus',
    'bi-shield-fill-plus', 'bi-shield-fill-x', 'bi-shield-lock-fill', 'bi-shield-minus', 'bi-shield-minus-fill',
    'bi-shield-plus', 'bi-shield-plus-fill', 'bi-shield-shaded', 'bi-shield-slash-fill', 'bi-shield-x-fill',
    'bi-shift', 'bi-shift-fill', 'bi-shop-window', 'bi-shop-window-fill', 'bi-shuffle', 'bi-sign-dead-end',
    'bi-sign-dead-end-fill', 'bi-sign-do-not-enter', 'bi-sign-do-not-enter-fill', 'bi-sign-intersection',
    'bi-sign-intersection-fill', 'bi-sign-intersection-side', 'bi-sign-intersection-side-fill', 'bi-sign-intersection-t',
    'bi-sign-intersection-t-fill', 'bi-sign-intersection-y', 'bi-sign-intersection-y-fill', 'bi-sign-merge-left',
    'bi-sign-merge-left-fill', 'bi-sign-merge-right', 'bi-sign-merge-right-fill', 'bi-sign-no-left-turn',
    'bi-sign-no-left-turn-fill', 'bi-sign-no-parking', 'bi-sign-no-parking-fill', 'bi-sign-no-right-turn',
    'bi-sign-no-right-turn-fill', 'bi-sign-railroad', 'bi-sign-railroad-fill', 'bi-sign-stop', 'bi-sign-stop-fill',
    'bi-sign-stop-lights', 'bi-sign-stop-lights-fill', 'bi-sign-turn-left', 'bi-sign-turn-left-fill',
    'bi-sign-turn-right', 'bi-sign-turn-right-fill', 'bi-sign-turn-slight-left', 'bi-sign-turn-slight-left-fill',
    'bi-sign-turn-slight-right', 'bi-sign-turn-slight-right-fill', 'bi-sign-yield', 'bi-sign-yield-fill',
    'bi-signpost', 'bi-signpost-2', 'bi-signpost-2-fill', 'bi-signpost-fill', 'bi-signpost-split', 'bi-signpost-split-fill',
    'bi-sim', 'bi-sim-fill', 'bi-sim-slash', 'bi-sim-slash-fill', 'bi-skip-backward', 'bi-skip-backward-btn',
    'bi-skip-backward-btn-fill', 'bi-skip-backward-circle', 'bi-skip-backward-circle-fill', 'bi-skip-backward-fill',
    'bi-skip-end', 'bi-skip-end-btn', 'bi-skip-end-btn-fill', 'bi-skip-end-circle', 'bi-skip-end-circle-fill',
    'bi-skip-end-fill', 'bi-skip-forward', 'bi-skip-forward-btn', 'bi-skip-forward-btn-fill', 'bi-skip-forward-circle',
    'bi-skip-forward-circle-fill', 'bi-skip-forward-fill', 'bi-skip-start', 'bi-skip-start-btn', 'bi-skip-start-btn-fill',
    'bi-skip-start-circle', 'bi-skip-start-circle-fill', 'bi-skip-start-fill', 'bi-slack', 'bi-slash-circle',
    'bi-slash-circle-fill', 'bi-slash-lg', 'bi-slash-square', 'bi-slash-square-fill', 'bi-sliders', 'bi-sliders2',
    'bi-smartwatch', 'bi-snapchat', 'bi-snow', 'bi-snow2', 'bi-snow3', 'bi-sort-alpha-down', 'bi-sort-alpha-down-alt',
    'bi-sort-alpha-up', 'bi-sort-alpha-up-alt', 'bi-sort-down', 'bi-sort-down-alt', 'bi-sort-numeric-down',
    'bi-sort-numeric-down-alt', 'bi-sort-numeric-up', 'bi-sort-numeric-up-alt', 'bi-sort-up', 'bi-sort-up-alt',
    'bi-soundwave', 'bi-speaker', 'bi-speaker-fill', 'bi-speedometer', 'bi-speedometer2', 'bi-spotify', 'bi-square',
    'bi-square-fill', 'bi-square-half', 'bi-stack', 'bi-stack-overflow', 'bi-stack-overflow-fill', 'bi-star-fill',
    'bi-star-half', 'bi-stars', 'bi-steam', 'bi-stickies', 'bi-stickies-fill', 'bi-sticky', 'bi-sticky-fill',
    'bi-stop-btn', 'bi-stop-btn-fill', 'bi-stop-circle-fill', 'bi-stop-fill', 'bi-stopwatch-fill', 'bi-strava',
    'bi-stripe', 'bi-subscript', 'bi-subtract', 'bi-suitcase', 'bi-suitcase-fill', 'bi-suitcase-lg', 'bi-suitcase-lg-fill',
    'bi-suitcase2', 'bi-suitcase2-fill', 'bi-sun-fill', 'bi-sunrise', 'bi-sunrise-fill', 'bi-sunset', 'bi-sunset-fill',
    'bi-symmetry-horizontal', 'bi-symmetry-vertical', 'bi-table', 'bi-tablet-fill', 'bi-tag-fill', 'bi-tags',
    'bi-tags-fill', 'bi-telephone-fill', 'bi-telephone-forward', 'bi-telephone-forward-fill', 'bi-telephone-inbound',
    'bi-telephone-inbound-fill', 'bi-telephone-minus', 'bi-telephone-minus-fill', 'bi-telephone-outbound',
    'bi-telephone-outbound-fill', 'bi-telephone-plus', 'bi-telephone-plus-fill', 'bi-telephone-x', 'bi-telephone-x-fill',
    'bi-terminal', 'bi-terminal-dash', 'bi-terminal-fill', 'bi-terminal-plus', 'bi-terminal-split', 'bi-terminal-x',
    'bi-text-center', 'bi-text-indent-left', 'bi-text-indent-right', 'bi-text-left', 'bi-text-paragraph',
    'bi-text-right', 'bi-textarea', 'bi-textarea-resize', 'bi-textarea-t', 'bi-thermometer', 'bi-thermometer-half',
    'bi-thermometer-high', 'bi-thermometer-low', 'bi-thermometer-snow', 'bi-thermometer-sun', 'bi-three-dots',
    'bi-three-dots-vertical', 'bi-thunderbolt', 'bi-thunderbolt-fill', 'bi-ticket', 'bi-ticket-detailed',
    'bi-ticket-detailed-fill', 'bi-ticket-fill', 'bi-ticket-perforated', 'bi-ticket-perforated-fill', 'bi-tiktok',
    'bi-toggle-off', 'bi-toggle-on', 'bi-toggle2-off', 'bi-toggle2-on', 'bi-toggles', 'bi-toggles2', 'bi-tools',
    'bi-tornado', 'bi-train-front', 'bi-train-front-fill', 'bi-train-front-tunnel', 'bi-train-front-tunnel-fill',
    'bi-translate', 'bi-trash-fill', 'bi-trash2', 'bi-trash2-fill', 'bi-trash3', 'bi-trash3-fill', 'bi-tree',
    'bi-tree-fill', 'bi-triangle', 'bi-triangle-fill', 'bi-triangle-half', 'bi-trophy-fill', 'bi-tropical-storm',
    'bi-truck', 'bi-truck-flatbed', 'bi-truck-flatbed-fill', 'bi-truck-front', 'bi-truck-front-fill',
    'bi-truck-front-tunnel', 'bi-truck-front-tunnel-fill', 'bi-tsunami', 'bi-tv', 'bi-tv-fill', 'bi-twitch',
    'bi-twitter', 'bi-twitter-x', 'bi-type', 'bi-type-bold', 'bi-type-h1', 'bi-type-h2', 'bi-type-h3', 'bi-type-h4',
    'bi-type-h5', 'bi-type-h6', 'bi-type-italic', 'bi-type-strikethrough', 'bi-type-underline', 'bi-ubuntu',
    'bi-ui-checks', 'bi-ui-checks-grid', 'bi-ui-radios', 'bi-ui-radios-grid', 'bi-umbrella', 'bi-umbrella-fill',
    'bi-unindent', 'bi-universal-access', 'bi-universal-access-circle', 'bi-unlock', 'bi-unlock-fill', 'bi-upc',
    'bi-upc-scan', 'bi-upload', 'bi-usb', 'bi-usb-c', 'bi-usb-c-fill', 'bi-usb-drive', 'bi-usb-drive-fill',
    'bi-usb-fill', 'bi-usb-micro', 'bi-usb-micro-fill', 'bi-usb-mini', 'bi-usb-mini-fill', 'bi-usb-plug',
    'bi-usb-plug-fill', 'bi-usb-symbol', 'bi-valentine', 'bi-valentine2', 'bi-vector-pen', 'bi-view-list',
    'bi-view-stacked', 'bi-vignette', 'bi-vimeo', 'bi-vinyl', 'bi-vinyl-fill', 'bi-virus', 'bi-virus2',
    'bi-voicemail', 'bi-volume-down', 'bi-volume-down-fill', 'bi-volume-mute', 'bi-volume-mute-fill',
    'bi-volume-off', 'bi-volume-off-fill', 'bi-volume-up', 'bi-volume-up-fill', 'bi-vr', 'bi-wallet-fill',
    'bi-wallet2', 'bi-wallet2-fill', 'bi-watch', 'bi-webcam', 'bi-webcam-fill', 'bi-wechat', 'bi-whatsapp',
    'bi-wifi-off', 'bi-wifi-1', 'bi-wifi-2', 'bi-window', 'bi-window-dash', 'bi-window-desktop', 'bi-window-fullscreen',
    'bi-window-split', 'bi-windows', 'bi-wordpress', 'bi-wrench', 'bi-wrench-adjustable', 'bi-wrench-adjustable-circle',
    'bi-wrench-adjustable-circle-fill', 'bi-x-circle-fill', 'bi-x-diamond', 'bi-x-diamond-fill', 'bi-x-lg',
    'bi-x-octagon', 'bi-x-octagon-fill', 'bi-x-square-fill', 'bi-xbox', 'bi-yelp', 'bi-yin-yang', 'bi-youtube',
    'bi-zoom-in', 'bi-zoom-out'
];

// Remove duplicates and sort
const UNIQUE_ICONS = [...new Set(BOOTSTRAP_ICONS)].sort();

// Create icon picker modal
function createIconPickerModal() {
    if (document.getElementById('iconPickerModal')) {
        return; // Already exists
    }
    
    const modal = document.createElement('div');
    modal.id = 'iconPickerModal';
    modal.className = 'icon-picker-modal';
    modal.innerHTML = `
        <div class="icon-picker-overlay"></div>
        <div class="icon-picker-container">
            <div class="icon-picker-header">
                <h3>Choose an Icon</h3>
                <button class="icon-picker-close" onclick="closeIconPicker()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="icon-picker-search">
                <input type="text" id="iconPickerSearch" placeholder="Search icons..." autocomplete="off">
            </div>
            <div class="icon-picker-grid" id="iconPickerGrid">
                ${UNIQUE_ICONS.map(icon => `
                    <div class="icon-picker-item" data-icon="${icon}" title="${icon}">
                        <i class="bi ${icon}"></i>
                        <span class="icon-name">${icon.replace('bi-', '')}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Search functionality
    const searchInput = document.getElementById('iconPickerSearch');
    const iconGrid = document.getElementById('iconPickerGrid');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = iconGrid.querySelectorAll('.icon-picker-item');
        
        items.forEach(item => {
            const iconName = item.getAttribute('data-icon').toLowerCase();
            if (iconName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Click outside to close
    modal.querySelector('.icon-picker-overlay').addEventListener('click', closeIconPicker);
}

// Open icon picker
window.openIconPicker = function(inputElement) {
    createIconPickerModal();
    const modal = document.getElementById('iconPickerModal');
    const iconGrid = document.getElementById('iconPickerGrid');
    
    // Store reference to input element
    modal.dataset.targetInput = inputElement.id || inputElement.className;
    modal.dataset.targetElement = inputElement;
    
    // Highlight currently selected icon
    const currentIcon = inputElement.value || inputElement.getAttribute('data-current-icon') || '';
    const items = iconGrid.querySelectorAll('.icon-picker-item');
    items.forEach(item => {
        if (item.getAttribute('data-icon') === currentIcon) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Add click handlers to icon items
    items.forEach(item => {
        // Remove any existing listeners by cloning
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', function() {
            const selectedIcon = this.getAttribute('data-icon');
            inputElement.value = selectedIcon;
            
            // Update preview if exists (icon picker's built-in preview)
            const preview = inputElement.parentElement.querySelector('.icon-picker-preview');
            if (preview) {
                preview.innerHTML = `<i class="bi ${selectedIcon}"></i>`;
            }
            
            // Also trigger input event so custom previews can update
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            closeIconPicker();
        });
    });
    
    modal.style.display = 'flex';
    document.getElementById('iconPickerSearch').focus();
};

// Close icon picker
window.closeIconPicker = function() {
    const modal = document.getElementById('iconPickerModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('iconPickerSearch').value = '';
        // Reset search
        const items = modal.querySelectorAll('.icon-picker-item');
        items.forEach(item => {
            item.style.display = 'flex';
        });
    }
};

// Initialize icon picker for an input field
window.initIconPicker = function(inputSelector, previewSelector = null) {
    const inputs = typeof inputSelector === 'string' 
        ? document.querySelectorAll(inputSelector) 
        : [inputSelector];
    
    inputs.forEach(input => {
        if (input.dataset.iconPickerInitialized) return;
        input.dataset.iconPickerInitialized = 'true';
        
        // Create wrapper if needed
        let wrapper = input.parentElement;
        if (!wrapper.classList.contains('icon-picker-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'icon-picker-wrapper';
            input.parentElement.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = 'icon-picker-preview';
        const currentIcon = input.value || input.getAttribute('value') || 'bi-star';
        preview.innerHTML = `<i class="bi ${currentIcon}"></i>`;
        wrapper.insertBefore(preview, input);
        
        // Create picker button
        const pickerBtn = document.createElement('button');
        pickerBtn.type = 'button';
        pickerBtn.className = 'icon-picker-btn';
        pickerBtn.innerHTML = '<i class="bi bi-grid-3x3"></i> Choose Icon';
        pickerBtn.onclick = () => openIconPicker(input);
        wrapper.appendChild(pickerBtn);
        
        // Update preview when input changes
        input.addEventListener('input', () => {
            const icon = input.value || 'bi-star';
            preview.innerHTML = `<i class="bi ${icon}"></i>`;
        });
        
        // Hide text input (optional - can keep it visible for manual entry)
        input.style.display = 'none';
    });
};

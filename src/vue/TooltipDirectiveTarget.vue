<template>
  <div
    id="tooltip-arrow"
    popover="manual"
    anchor="tooltip-toggle"
    class="arrow isolate bg-transparent"
  ></div>
  <div
    id="tooltip"
    popover="manual"
    anchor="tooltip-toggle"
    class="max-h-50 w-fit overflow-visible rounded-md bg-slate-900 px-3 py-2 text-center leading-3 text-white text-sm"
  >
    <span id="tooltip-text" class="type-label-sm whitespace-pre"></span>
  </div>
</template>

<style>
@reference '../core/styles/tailwind.css';

#tooltip-arrow {
  z-index: -10;
  position-anchor: --tooltip-toggle;

  &[position='top'],
  &[position='bottom'] {
    margin-block: 4px;
    position-try-fallbacks: flip-block;

    height: calc(anchor-size(--tooltip height) + 4px);
    width: 8px;
    &:after {
      z-index: -10;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      @apply bg-gray-900;
      clip-path: polygon(
        50% 0,
        100% 4px,
        100% calc(100% - 4px),
        50% calc(100%),
        0 calc(100% - 4px),
        100% calc(100% - 4px),
        100% 4px,
        0 4px
      );
    }
  }
  &[position='left'],
  &[position='right'] {
    margin-inline: 4px;
    position-try-fallbacks: flip-inline;

    height: 12px;
    width: calc(anchor-size(--tooltip width) + 4px);
    &:after {
      z-index: -10;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      @apply bg-gray-900;
      clip-path: polygon(
        0 50%,
        6px 100%,
        calc(100% - 6px) 100%,
        calc(100%) 50%,
        calc(100% - 6px) 0,
        calc(100% - 6px) 100%,
        6px 100%,
        6px 0
      );
    }
  }

  &[position='top'] {
    position-area: top center;
  }

  &[position='bottom'] {
    position-area: bottom center;
  }

  &[position='left'] {
    position-area: center left;
  }

  &[position='right'] {
    position-area: center right;
  }
}

#tooltip {
  z-index: 100;
  position: fixed;
  pointer-events: none;
  position-anchor: --tooltip-toggle;
  anchor-name: --tooltip;
  transform: translateZ(1px);
  /*inset-block-start: anchor(bottom);
  justify-self: safe anchor-center;*/

  &[position='top'],
  &[position='bottom'] {
    margin-block: 8px;
  }
  &[position='left'],
  &[position='right'] {
    margin-inline: 8px;
  }

  &[position='top'] {
    position-area: top;
    position-try-fallbacks:
      top span-all,
      bottom,
      bottom span-all;
  }

  &[position='bottom'] {
    position-area: bottom;
    position-try-fallbacks:
      bottom span-all,
      top,
      top span-all;
  }

  &[position='left'] {
    position-area: left;
    position-try-fallbacks:
      span-all left,
      right,
      span-all right;
  }

  &[position='right'] {
    position-area: right;
    position-try-fallbacks:
      span-all right,
      left,
      span-all left;
  }
}
</style>

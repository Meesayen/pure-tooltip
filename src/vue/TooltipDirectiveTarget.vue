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

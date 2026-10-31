<script lang="ts">
  let { text = '' }: { text?: string } = $props()
</script>

<span title={text}>
  <slot />
</span>

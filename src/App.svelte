<script lang="ts">
  import { downloadSvg, download, fileName, svgToPng } from './lib/export';
  import { getMotif, MOTIFS } from './lib/motifs';
  import { getPalette, PALETTES } from './lib/palettes';
  import { renderSvg } from './lib/render';
  import { randomSeed } from './lib/rng';
  import { decodeState, encodeState, getSize, SCALE_MAX, SCALE_MIN, SIZES, type AppState } from './lib/state';

  let st: AppState = $state(decodeState(location.hash));
  let toast = $state('');
  let busy = $state(false);

  const size = $derived(getSize(st.size));
  const motif = $derived(getMotif(st.motif));
  const palette = $derived(getPalette(st.palette));
  const svg = $derived(renderSvg({ ...st, width: size.width, height: size.height, uid: 'main' }));
  const thumbs = $derived(
    MOTIFS.map((m) => ({
      m,
      svg: renderSvg({ motif: m.id, palette: st.palette, seed: st.seed, scale: 34, width: 132, height: 84, crackle: false, uid: `t-${m.id}` }),
    })),
  );
  const name = $derived(fileName([motif.id, palette.id, st.seed], 'svg'));

  $effect(() => {
    history.replaceState(null, '', '#' + encodeState(st));
  });

  let toastTimer: ReturnType<typeof setTimeout>;
  function say(msg: string) {
    toast = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast = ''), 2200);
  }

  function reroll() {
    st.seed = randomSeed();
  }

  function surprise() {
    st.motif = MOTIFS[Math.floor(Math.random() * MOTIFS.length)].id;
    st.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)].id;
    st.scale = Math.round(SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN) * 0.6);
    reroll();
  }

  async function savePng() {
    busy = true;
    try {
      download(await svgToPng(svg, size.width, size.height), name.replace(/\.svg$/, '.png'));
      say('PNG saved');
    } catch (e) {
      say((e as Error).message);
    } finally {
      busy = false;
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      say('Link copied — same seed, same cloth');
    } catch {
      say('Copy failed, use the address bar');
    }
  }

  function onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    if (t.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'r') reroll();
    if (e.key === 's') surprise();
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const i = MOTIFS.findIndex((m) => m.id === st.motif);
      const d = e.key === 'ArrowRight' ? 1 : -1;
      st.motif = MOTIFS[(i + d + MOTIFS.length) % MOTIFS.length].id;
    }
  }
</script>

<svelte:window onkeydown={onKey} onhashchange={() => (st = decodeState(location.hash))} />

<div class="app">
  <aside class="panel">
    <header>
      <h1>batik<span>·</span>gen</h1>
      <p class="tag">Generative Indonesian batik, drawn with code instead of a canting.</p>
    </header>

    <section>
      <h2>Motif</h2>
      <div class="motifs">
        {#each thumbs as { m, svg: t } (m.id)}
          <button class="motif" class:active={st.motif === m.id} onclick={() => (st.motif = m.id)} aria-pressed={st.motif === m.id}>
            <span class="thumb">{@html t}</span>
            <span>{m.name}</span>
          </button>
        {/each}
      </div>
    </section>

    <section>
      <h2>Palette</h2>
      <div class="palettes">
        {#each PALETTES as p (p.id)}
          <button class="pal" class:active={st.palette === p.id} onclick={() => (st.palette = p.id)} title={p.note} aria-pressed={st.palette === p.id}>
            <span class="sw">
              {#each [p.bg, p.ink, p.accent, p.light] as c}<i style:background={c}></i>{/each}
            </span>
            {p.name}
          </button>
        {/each}
      </div>
      <p class="note">{palette.note}</p>
    </section>

    <section class="grid2">
      <label class="field wide">
        <span>Seed</span>
        <div class="seed">
          <input bind:value={st.seed} maxlength="64" spellcheck="false" />
          <button class="icon" onclick={reroll} title="New seed (R)" aria-label="New seed">⟳</button>
        </div>
      </label>
      <label class="field wide">
        <span>Repeat size <b>{st.scale}px</b></span>
        <input type="range" min={SCALE_MIN} max={SCALE_MAX} step="2" bind:value={st.scale} />
      </label>
      <label class="field wide">
        <span>Canvas</span>
        <select bind:value={st.size}>
          {#each SIZES as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
        </select>
      </label>
      <label class="check wide">
        <input type="checkbox" bind:checked={st.crackle} />
        <span>Wax cracks <em>(remukan)</em></span>
      </label>
    </section>

    <section class="actions">
      <button class="primary" onclick={() => { downloadSvg(svg, name); say('SVG saved'); }}>Download SVG</button>
      <button onclick={savePng} disabled={busy}>{busy ? 'Rendering…' : 'Download PNG'}</button>
      <button onclick={copyLink}>Copy link</button>
      <button onclick={surprise} title="Random everything (S)">Surprise me</button>
    </section>

    <footer>
      <kbd>R</kbd> new seed · <kbd>S</kbd> surprise · <kbd>←</kbd><kbd>→</kbd> motif
    </footer>
  </aside>

  <main class="stage">
    <figure class="cloth" style:aspect-ratio="{size.width} / {size.height}" style:--ar={size.width / size.height}>
      {@html svg}
    </figure>
    <article class="info">
      <h3>{motif.name}</h3>
      <p class="origin">{motif.origin}</p>
      <p>{motif.meaning}</p>
      <p class="meta">{size.width}×{size.height} · seed <code>{st.seed}</code></p>
    </article>
  </main>

  {#if toast}<div class="toast" role="status">{toast}</div>{/if}
</div>

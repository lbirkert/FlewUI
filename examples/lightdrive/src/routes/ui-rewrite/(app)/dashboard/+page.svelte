<script lang="ts">
  let { data } = $props();

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  const typeColors: Record<string, string> = {
    images: "#3b82f6", documents: "#22c55e", archives: "#f59e0b",
    audio: "#a855f7", video: "#ef4444", other: "#6b7280",
  };

  const typeLabels: Record<string, string> = {
    images: "Images", documents: "Documents", archives: "Archives",
    audio: "Audio", video: "Video", other: "Other",
  };

  let totalPct = $derived(data.breakdown.reduce((s: number, t: { size: number }) => s + t.size, 0));
</script>

<div class="dashboard">
  <h1>Dashboard</h1>

  <div class="stat-grid">
    <div class="stat-card">
      <h3>Total Files</h3>
      <p class="stat-value">{data.stats.totalFiles}</p>
    </div>
    <div class="stat-card">
      <h3>Downloads</h3>
      <p class="stat-value">{data.stats.totalDownloads}</p>
    </div>
    <div class="stat-card">
      <h3>Active Users</h3>
      <p class="stat-value">{data.stats.totalFiles > 0 ? 1 : 0}</p>
    </div>
    <div class="stat-card">
      <h3>Storage Used</h3>
      <p class="stat-value">{formatSize(data.stats.totalSize)}</p>
    </div>
  </div>

  <div class="chart-grid">
    <div class="chart-card">
      <h2>Storage by Type</h2>
      <ul class="breakdown-list">
        {#each data.breakdown as t}
          {@const pct = totalPct > 0 ? (t.size / totalPct * 100) : 0}
          <li>
            <span class="breakdown-label">{typeLabels[t.type] ?? t.type}</span>
            <span class="breakdown-count">{t.count} file{t.count !== 1 ? "s" : ""}</span>
            <span class="breakdown-pct">{pct.toFixed(0)}%</span>
            <div class="bar"><div class="bar-fill" style="width:{pct}%"></div></div>
          </li>
        {:else}
          <li>No data yet</li>
        {/each}
      </ul>
    </div>

    <div class="chart-card">
      <h2>File Size Distribution</h2>
      {#if data.sizeDist.some((s: { count: number }) => s.count > 0)}
        <ul class="size-list">
          {#each data.sizeDist as s}
            <li><span>{s.label}</span><span>{s.count} files</span></li>
          {/each}
        </ul>
      {:else}
        <p>No data yet</p>
      {/if}
    </div>
  </div>

  <div class="chart-grid">
    <div class="chart-card">
      <h2>Upload Activity (30 days)</h2>
      {#if data.recentUploads.some((d: { count: number }) => d.count > 0)}
        <ul class="activity-list">
          {#each data.recentUploads as d}
            <li><span>{d.date}</span><span>{d.count} uploads</span></li>
          {/each}
        </ul>
      {:else}
        <p>No uploads yet</p>
      {/if}
    </div>

    <div class="chart-card">
      <h2>Top Downloads</h2>
      {#if data.topDownloads.length > 0}
        <ol class="downloads-list">
          {#each data.topDownloads as f}
            <li><span>{f.originalName}</span><span>{f.downloads} downloads</span></li>
          {/each}
        </ol>
      {:else}
        <p>No downloads yet</p>
      {/if}
    </div>
  </div>
</div>

<script lang="ts">
  import { formatSize, formatFullDate, getPreviewUrl } from "./helpers";

  type Props = {
    driveId: string;
    filePreviewId: string | null;
    previewFile: any;
    previewCategory: string | null;
    previewContent: any;
    previewLoading: boolean;
    previewError: string;
    previewFiles: any[];
    previewFileIndex: number;
    editMode: boolean;
    editText: string;
    onclose?: () => void;
    ongotoprev: () => void;
    ongotonext: () => void;
    onenableedit?: () => void;
    onsaveedit?: () => void;
    oncanceledit?: () => void;
    onshare?: (id: string, name: string, type: "file" | "folder") => void;
    ondelete?: (id: string) => void;
  };

  let {
    driveId, filePreviewId, previewFile, previewCategory, previewContent,
    previewLoading, previewError, previewFiles, previewFileIndex,
    editMode = $bindable(), editText = $bindable(),
    onclose, ongotoprev, ongotonext, onenableedit, onsaveedit, oncanceledit,
    onshare, ondelete,
  }: Props = $props();

  function isEditable() {
    return previewCategory === "txt" || previewCategory === "md" || previewCategory === "csv" || previewCategory === "docx";
  }
</script>

{#if filePreviewId && previewFile}
  <div class="file-preview">
    <div class="preview-edit-bar">
      {#if editMode && onsaveedit && oncanceledit}
        <button class="preview-btn" onclick={onsaveedit}>Save</button>
        <button class="preview-btn" onclick={oncanceledit}>Cancel</button>
      {:else if isEditable() && onenableedit}
        <button class="preview-btn" onclick={onenableedit}>Edit</button>
      {/if}
    </div>
    <div class="preview-body">
      {#if previewCategory === "image"}
        <div class="preview-image-wrap">
          {#if previewFile.hasPreview}
            <img src={getPreviewUrl(previewFile.id, driveId)} alt={previewFile.originalName} class="preview-image" />
          {:else}
            <img src="/api/drive/{driveId}/files/{previewFile.id}/download" alt={previewFile.originalName} class="preview-image" />
          {/if}
        </div>
      {:else if previewCategory === "pdf"}
        <embed src="/api/drive/{driveId}/files/{previewFile.id}/download?inline=1" type="application/pdf" class="preview-pdf" />
      {:else if previewLoading}
        <div class="preview-loading">Loading...</div>
      {:else if previewError}
        <div class="preview-error">
          <span class="error-text">{previewError}</span>
          <a href="/api/drive/{driveId}/files/{previewFile.id}/download" download={previewFile.originalName} class="preview-btn">Download</a>
        </div>
      {:else if (previewCategory === "txt" || previewCategory === "md" || previewCategory === "csv") && previewContent}
        {#if editMode}
          <textarea class="preview-textarea" bind:value={editText}></textarea>
        {:else if previewCategory === "md" && previewContent.html}
          <div class="preview-doc">
            {@html previewContent.html}
          </div>
        {:else if previewCategory === "csv" && previewContent.rows}
          <div class="preview-sheet">
            <table class="sheet-table">
              <tbody>
                {#each previewContent.rows as row}
                  <tr>{#each row as cell}<td>{cell == null ? "" : cell}</td>{/each}</tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <textarea class="preview-textarea" readonly value={previewContent.content}></textarea>
        {/if}
      {:else if previewCategory === "docx" && previewContent}
        {#if editMode}
          <textarea class="preview-textarea" bind:value={editText}></textarea>
        {:else}
          <div class="preview-doc">
            {#if previewContent.content}
              {@html previewContent.content}
            {:else}
              <span>No content</span>
            {/if}
          </div>
        {/if}
      {:else if previewCategory === "xlsx" && previewContent}
        <div class="preview-sheet">
          {#each Object.entries(previewContent.content || {}) as [sheetName, rows]}
            <div class="sheet-section">
              <h4>{sheetName}</h4>
              <table class="sheet-table">
                <tbody>
                  {#each (rows as any) as row}
                    <tr>{#each row as cell}<td>{cell == null ? "" : cell}</td>{/each}</tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/each}
        </div>
      {:else if previewCategory === "audio"}
        <div class="preview-audio">
          <p>{previewFile.originalName}</p>
          {#key filePreviewId}
            <audio controls autoplay class="audio-player">
              <source src="/api/drive/{driveId}/files/{previewFile.id}/download" type={previewFile.type} />
            </audio>
          {/key}
        </div>
      {:else if previewCategory === "video"}
        <div class="preview-video">
          {#key filePreviewId}
            <video controls autoplay class="video-player" poster={previewFile.hasPreview ? getPreviewUrl(previewFile.id, driveId) : undefined}>
              <source src="/api/drive/{driveId}/files/{previewFile.id}/stream" type="video/webm" />
            </video>
          {/key}
        </div>
      {:else}
        <div class="preview-unknown">
          <p>{formatSize(previewFile.size)}</p>
          <a href="/api/drive/{driveId}/files/{previewFile.id}/download" download={previewFile.originalName} class="preview-btn">Download</a>
        </div>
      {/if}
    </div>
    <div class="preview-footer">
      <div class="preview-file-info">
        <span class="file-name">{previewFile.originalName}</span>
        <span class="file-meta">{formatSize(previewFile.size)} &middot; {formatFullDate(previewFile.uploadedAt)}</span>
      </div>
      <div class="preview-actions">
        <button class="preview-btn" disabled={previewFileIndex <= 0} onclick={ongotoprev} aria-label="Previous">&larr;</button>
        <button class="preview-btn" disabled={previewFileIndex < 0 || previewFileIndex >= previewFiles.length - 1} onclick={ongotonext} aria-label="Next">&rarr;</button>
        <a href="/api/drive/{driveId}/files/{previewFile.id}/download" download={previewFile.originalName} class="preview-btn">Download</a>
        {#if onshare}
          <button class="preview-btn" onclick={() => onshare(previewFile.id, previewFile.originalName, "file")} aria-label="Share">Share</button>
        {/if}
        {#if ondelete}
          <button class="preview-btn" onclick={() => ondelete(previewFile.id)} aria-label="Delete">Delete</button>
        {/if}
        {#if onclose}
          <button class="preview-btn" onclick={onclose} aria-label="Close">Close</button>
        {/if}
      </div>
    </div>
  </div>
{/if}

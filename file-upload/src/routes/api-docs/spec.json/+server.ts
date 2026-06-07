import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return json(spec);
};

const spec = {
  openapi: "3.1.0",
  info: {
    title: "LightDrive API",
    version: "2.0.0",
    description:
      "RESTful API for LightDrive — a personal cloud storage solution. Use `/api/drive/{driveId}/...` endpoints for drive-aware access (works with both user IDs and share tokens). Legacy `/api/files` and `/api/folders` endpoints require session auth.\n\nBase URL: `/api`",
  },
  servers: [{ url: "/", description: "Local development" }],
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a new account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Jane Doe" },
                  email: { type: "string", format: "email", example: "jane@example.com" },
                  password: { type: "string", minLength: 8, example: "s3cret!123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Account created" },
          "400": { description: "Validation error" },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Sign in to existing account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Authenticated" },
          "401": { description: "Invalid email or password" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Sign out and destroy session",
        responses: { "200": { description: "Logged out" } },
      },
    },
    "/api/auth/profile": {
      patch: {
        tags: ["Auth"],
        summary: "Update profile name",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: { name: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Profile updated" },
          "401": { description: "Not authenticated" },
        },
      },
    },
    "/api/auth/password": {
      patch: {
        tags: ["Auth"],
        summary: "Change password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Password changed" },
          "401": { description: "Not authenticated or incorrect current password" },
        },
      },
    },
    "/api/folders": {
      get: {
        tags: ["Folders"],
        summary: "List folders (optionally nested)",
        parameters: [
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token for shared drive" },
          { name: "parentId", in: "query", required: false, schema: { type: "string" }, description: "If omitted, returns root folders (or shared folder root)" },
          { name: "all", in: "query", required: false, schema: { type: "string", enum: ["true"] }, description: "List all folders for the move dialog (not available for shared drives)" },
        ],
        responses: {
          "200": { description: "Folder list" },
        },
      },
      post: {
        tags: ["Folders"],
        summary: "Create a new folder",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  parentId: { type: "string", description: "Parent folder ID for nested folders" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Folder created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/folders/{id}": {
      delete: {
        tags: ["Folders"],
        summary: "Delete a folder (cascades to children)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Folder deleted" },
          "404": { description: "Folder not found" },
        },
      },
    },
    "/api/files": {
      get: {
        tags: ["Files"],
        summary: "List files in a folder",
        parameters: [
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token for shared drive" },
          { name: "folderId", in: "query", required: false, schema: { type: "string" }, description: "If omitted, returns root-level files (or shared folder root)" },
        ],
        responses: { "200": { description: "File list" } },
      },
      post: {
        tags: ["Files"],
        summary: "Upload files (multipart)",
        parameters: [{ name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token with upload permission for shared drive" }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["files"],
                properties: {
                  files: { type: "array", items: { type: "string", format: "binary" }, description: "One or more files to upload" },
                  folderId: { type: "string", description: "Target folder ID (optional)" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Upload result" } },
      },
    },
    "/api/files/document": {
      post: {
        tags: ["Files"],
        summary: "Create a new blank document",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "name"],
                properties: {
                  type: { type: "string", enum: ["txt", "md", "csv"], description: "Document type" },
                  name: { type: "string", description: "File name (extension added automatically)" },
                  folderId: { type: "string", description: "Target folder ID (optional)" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Document created" } },
      },
    },
    "/api/files/{id}/content": {
      get: {
        tags: ["Files"],
        summary: "Get file content for preview/editing",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token for shared drive" },
        ],
        responses: {
          "200": { description: "Content: text for .txt, HTML for .docx, JSON sheet data for .xlsx" },
          "401": { description: "Not authenticated" },
          "404": { description: "File not found" },
        },
      },
      put: {
        tags: ["Files"],
        summary: "Save file content (editable types: txt, xlsx)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token with edit permission" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { content: { description: "For txt: string. For xlsx: Record<string, any[][]>" } },
              },
            },
          },
        },
        responses: { "200": { description: "Content saved" }, "400": { description: "File type not editable" } },
      },
    },
    "/api/files/{id}": {
      delete: {
        tags: ["Files"],
        summary: "Delete a file",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token with delete permission" },
        ],
        responses: { "200": { description: "File deleted" }, "404": { description: "File not found" } },
      },
      patch: {
        tags: ["Files"],
        summary: "Move a file to a different folder",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "driveId", in: "query", required: true, schema: { type: "string" }, description: "User ID for personal drive (not available for shared drives)" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { folderId: { type: "string", nullable: true, description: "Target folder ID (null for root)" } },
              },
            },
          },
        },
        responses: { "200": { description: "File moved" } },
      },
    },
    "/api/files/{id}/download": {
      get: {
        tags: ["Files"],
        summary: "Download a file (or view inline with ?inline=1)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "inline", in: "query", required: false, schema: { type: "string", enum: ["1"] }, description: "Set to 1 for inline Content-Disposition (for PDF embedding)" },
        ],
        responses: { "200": { description: "File binary stream", content: { "application/octet-stream": {} } }, "404": { description: "File not found" } },
      },
    },
    "/api/files/{id}/preview": {
      get: {
        tags: ["Files"],
        summary: "Get file preview image (WebP thumbnail)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "WebP preview image", content: { "image/webp": {} } }, "404": { description: "Preview not found" } },
      },
    },
    "/api/shares": {
      post: {
        tags: ["Shares"],
        summary: "Create a share link for a file or folder",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fileId: { type: "string", description: "File ID (mutually exclusive with folderId)" },
                  folderId: { type: "string", description: "Folder ID (mutually exclusive with fileId)" },
                  permissions: { type: "string", default: "read", description: "Comma-separated: read,upload,delete,edit" },
                  expiresInHours: { type: "integer", nullable: true, description: "Link expiration in hours (null = never)" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Share link created" }, "404": { description: "File/Folder not found" } },
      },
      get: {
        tags: ["Shares"],
        summary: "List shares for a file, folder, or all",
        parameters: [
          { name: "fileId", in: "query", required: false, schema: { type: "string" } },
          { name: "folderId", in: "query", required: false, schema: { type: "string" } },
          { name: "all", in: "query", required: false, schema: { type: "string", enum: ["true"] }, description: "List all shares for the current user" },
        ],
        responses: { "200": { description: "Share list" } },
      },
      patch: {
        tags: ["Shares"],
        summary: "Update share link permissions or expiration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string" },
                  permissions: { type: "string", description: "Comma-separated: read,upload,delete,edit" },
                  expiresInHours: { type: "integer", nullable: true },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Share updated" } },
      },
      delete: {
        tags: ["Shares"],
        summary: "Revoke a share link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
            },
          },
        },
        responses: { "200": { description: "Share revoked" } },
      },
    },
    "/api/shares/{token}": {
      get: {
        tags: ["Shares"],
        summary: "Get share info or download shared file / browse shared folder",
        parameters: [{ name: "token", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Share info (JSON) or file binary" },
          "404": { description: "Share not found" },
          "410": { description: "Share link expired" },
        },
      },
    },
    "/api/drive/{driveId}/files": {
      get: {
        tags: ["Drive"],
        summary: "List files in a folder within a drive",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token for shared drive" },
          { name: "folderId", in: "query", required: false, schema: { type: "string" }, description: "If omitted, returns root-level files (or shared folder root)" },
        ],
        responses: { "200": { description: "File list" } },
      },
      post: {
        tags: ["Drive"],
        summary: "Upload files to a drive",
        parameters: [{ name: "driveId", in: "path", required: true, schema: { type: "string" }, description: "User ID for personal drive, or share token with upload permission" }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["files"],
                properties: {
                  files: { type: "array", items: { type: "string", format: "binary" } },
                  folderId: { type: "string", description: "Target folder ID (optional)" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Upload result" } },
      },
    },
    "/api/drive/{driveId}/files/{fileId}": {
      delete: {
        tags: ["Drive"],
        summary: "Delete a file from a drive",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "fileId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "File deleted" } },
      },
      patch: {
        tags: ["Drive"],
        summary: "Move a file within a drive (user drives only)",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "fileId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { folderId: { type: "string", nullable: true } },
              },
            },
          },
        },
        responses: { "200": { description: "File moved" } },
      },
    },
    "/api/drive/{driveId}/files/{fileId}/content": {
      get: {
        tags: ["Drive"],
        summary: "Get file content for preview/editing",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "fileId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Content by type" } },
      },
      put: {
        tags: ["Drive"],
        summary: "Save file content (requires edit permission for shares)",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "fileId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Content saved" } },
      },
    },
    "/api/drive/{driveId}/files/{fileId}/download": {
      get: {
        tags: ["Drive"],
        summary: "Download a file from a drive (supports Range for streaming)",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "fileId", in: "path", required: true, schema: { type: "string" } },
          { name: "inline", in: "query", required: false, schema: { type: "string", enum: ["1"] } },
        ],
        responses: { "200": { description: "File binary" } },
      },
    },
    "/api/drive/{driveId}/folders": {
      get: {
        tags: ["Drive"],
        summary: "List folders within a drive",
        parameters: [
          { name: "driveId", in: "path", required: true, schema: { type: "string" } },
          { name: "parentId", in: "query", required: false, schema: { type: "string" } },
          { name: "all", in: "query", required: false, schema: { type: "string", enum: ["true"] } },
        ],
        responses: { "200": { description: "Folder list" } },
      },
      post: {
        tags: ["Drive"],
        summary: "Create a folder in a drive (user drives only)",
        parameters: [{ name: "driveId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  parentId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Folder created" } },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      Folder: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          userId: { type: "string" },
          parentId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      File: {
        type: "object",
        properties: {
          id: { type: "string" },
          storedName: { type: "string" },
          originalName: { type: "string" },
          size: { type: "integer" },
          type: { type: "string" },
          userId: { type: "string" },
          folderId: { type: "string", nullable: true },
          hasPreview: { type: "boolean", description: "Whether a WebP preview thumbnail is available" },
          downloads: { type: "integer" },
          uploadedAt: { type: "string", format: "date-time" },
        },
      },
      Share: {
        type: "object",
        properties: {
          id: { type: "string" },
          fileId: { type: "string", nullable: true },
          folderId: { type: "string", nullable: true },
          token: { type: "string" },
          permissions: { type: "string" },
          expiresAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
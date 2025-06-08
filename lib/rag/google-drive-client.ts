import { google } from "googleapis"
import { RAG_CONFIG } from "./config"

class GoogleDriveManager {
  private drive: any
  private docs: any

  constructor() {
    if (RAG_CONFIG.googleDrive.serviceAccountKey) {
      const credentials = JSON.parse(RAG_CONFIG.googleDrive.serviceAccountKey)
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/documents.readonly",
        ],
      })

      this.drive = google.drive({ version: "v3", auth })
      this.docs = google.docs({ version: "v1", auth })
    }
  }

  async listFiles(folderId: string = RAG_CONFIG.googleDrive.folderId) {
    if (!this.drive) {
      throw new Error("Google Drive not configured")
    }

    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
        pageSize: 100,
      })

      return response.data.files || []
    } catch (error) {
      console.error("Error listing Google Drive files:", error)
      return []
    }
  }

  async getFileContent(fileId: string, mimeType: string) {
    if (!this.drive) {
      throw new Error("Google Drive not configured")
    }

    try {
      if (mimeType === "application/vnd.google-apps.document") {
        // Google Docs
        const response = await this.docs.documents.get({
          documentId: fileId,
        })

        return this.extractTextFromGoogleDoc(response.data)
      } else if (mimeType === "text/plain" || mimeType.includes("text/")) {
        // Plain text files
        const response = await this.drive.files.get({
          fileId,
          alt: "media",
        })

        return response.data
      } else {
        // For other file types, try to export as plain text
        const response = await this.drive.files.export({
          fileId,
          mimeType: "text/plain",
        })

        return response.data
      }
    } catch (error) {
      console.error(`Error getting content for file ${fileId}:`, error)
      return ""
    }
  }

  private extractTextFromGoogleDoc(doc: any): string {
    let text = ""

    if (doc.body && doc.body.content) {
      for (const element of doc.body.content) {
        if (element.paragraph) {
          for (const textElement of element.paragraph.elements || []) {
            if (textElement.textRun) {
              text += textElement.textRun.content
            }
          }
        } else if (element.table) {
          // Extract text from tables
          for (const row of element.table.tableRows || []) {
            for (const cell of row.tableCells || []) {
              for (const cellElement of cell.content || []) {
                if (cellElement.paragraph) {
                  for (const textElement of cellElement.paragraph.elements || []) {
                    if (textElement.textRun) {
                      text += textElement.textRun.content
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return text
  }

  async syncFolder(tenantId: string, folderId?: string) {
    const files = await this.listFiles(folderId)
    const syncedFiles = []

    for (const file of files) {
      try {
        const content = await this.getFileContent(file.id, file.mimeType)

        if (content && content.trim()) {
          syncedFiles.push({
            id: file.id,
            name: file.name,
            content: content.trim(),
            url: file.webViewLink,
            modifiedTime: file.modifiedTime,
            mimeType: file.mimeType,
          })
        }
      } catch (error) {
        console.error(`Error syncing file ${file.name}:`, error)
      }
    }

    return syncedFiles
  }
}

export const googleDriveManager = new GoogleDriveManager()

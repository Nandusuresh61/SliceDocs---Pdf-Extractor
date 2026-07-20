export const APP_MESSAGE = {
  PDF_UPLOADED: "PDF uploaded successfully.",

  PDF_REQUIRED: "PDF file is required.",

  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",

  GOOGLE_ID_TOKEN_REQUIRED: "Google ID Token is required",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  USER_NOT_FOUND: "User not found",
  AUTH_SUCCESS: "Authentication successful",
  LOGOUT_SUCCESS: "Logout successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  AUTH_REQUIRED: "Authentication required",
  INVALID_TOKEN: "Invalid or expired token",

  // Document messages
  DOCUMENT_NOT_FOUND: "Document not found",
  UNAUTHORIZED_DOCUMENT_ACCESS: "Unauthorized access to document",
  NO_PAGES_SELECTED: "No pages selected for extraction.",
  FETCH_PDF_FAILED: "Failed to fetch PDF from URL",
  RETRIEVE_PDF_FAILED: "Could not retrieve the original PDF file.",
  EXTRACTION_FAILED: "Failed to extract pages from the PDF. Ensure page numbers are valid.",
  
  FILES_RETRIEVED: "Files retrieved successfully",
  DOCUMENT_RETRIEVED: "Document retrieved successfully",
  PAGES_EXTRACTED: "Pages extracted successfully",
} as const;
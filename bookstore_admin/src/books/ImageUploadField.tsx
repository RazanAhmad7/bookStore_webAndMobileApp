import * as React from "react";
import { useState, useEffect } from "react";
import { useInput, useNotify, useTranslate, InputProps } from "react-admin";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { CloudUpload, Image as ImageIcon } from "@mui/icons-material";
// Remove the uploadFile import since we'll handle file uploads differently

interface ImageUploadFieldProps extends InputProps {
  source: string;
  label?: string;
  accept?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  source,
  label = "Image",
  accept = "image/*",
  ...props
}) => {
  const { field, fieldState } = useInput({ source, ...props });
  const notify = useNotify();
  const translate = useTranslate();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    field.value?.coverImagePreview ||
      (typeof field.value === "string" ? field.value : null) ||
      null
  );

  // Update preview when field value changes (for editing)
  useEffect(() => {
    // console.log("ImageUploadField field.value:", field.value); // Remove in production
    if (field.value?.coverImagePreview) {
      setPreview(field.value.coverImagePreview);
    } else if (
      typeof field.value === "string" &&
      (field.value.startsWith("http") || field.value.startsWith("/"))
    ) {
      setPreview(field.value);
    }
  }, [field.value]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file", { type: "error" });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("File size must be less than 5MB", { type: "error" });
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Store the file object for form submission
      // The backend will handle the actual file upload
      field.onChange(file);
      notify("Image selected successfully", { type: "success" });
    } catch (error) {
      console.error("File selection error:", error);
      notify("Failed to select image", { type: "error" });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    field.onChange("");
    setPreview(null);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      {preview && (
        <Card sx={{ mb: 2, maxWidth: 300 }}>
          <CardContent>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <Button
              size="small"
              color="error"
              onClick={handleRemove}
              sx={{ mt: 1 }}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        accept={accept}
        style={{ display: "none" }}
        id={`file-upload-${source}`}
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <label htmlFor={`file-upload-${source}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={
            uploading ? <CircularProgress size={20} /> : <CloudUpload />
          }
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </Button>
      </label>

      {fieldState.error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {fieldState.error.message}
        </Alert>
      )}

      {!preview && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
            mt: 1,
          }}
        >
          <ImageIcon fontSize="small" />
          <Typography variant="body2">
            No image selected. Click "Choose Image" to upload.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadField;

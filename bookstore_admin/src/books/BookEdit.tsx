import * as React from "react";
import {
  Edit,
  TabbedForm,
  TextInput,
  required,
  useDefaultTitle,
  useEditContext,
} from "react-admin";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { BookEditDetails } from "./BookEditDetails";
import ImageUploadField from "./ImageUploadField";

const RichTextInput = React.lazy(() =>
  import("ra-input-rich-text").then((module) => ({
    default: module.RichTextInput,
  }))
);

const BookTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useEditContext();
  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const BookEdit = () => (
  <Edit title={<BookTitle />}>
    <TabbedForm>
      <TabbedForm.Tab
        label="resources.books.tabs.image"
        sx={{ maxWidth: "40em", minHeight: 48 }}
        iconPosition="start"
        icon={<PhotoCameraIcon />}
      >
        <ImageUploadField source="coverImage" label="Cover Image" />
      </TabbedForm.Tab>
      <TabbedForm.Tab
        label="resources.books.tabs.details"
        path="details"
        sx={{ maxWidth: "40em", minHeight: 48 }}
        iconPosition="start"
        icon={<AspectRatioIcon />}
      >
        <BookEditDetails />
      </TabbedForm.Tab>
      <TabbedForm.Tab
        label="resources.books.tabs.description"
        path="description"
        sx={{ maxWidth: "40em", minHeight: 48 }}
        iconPosition="start"
        icon={<EditNoteIcon />}
      >
        <RichTextInput source="description" label="" validate={req} />
      </TabbedForm.Tab>
    </TabbedForm>
  </Edit>
);

const req = [required()];

export default BookEdit;

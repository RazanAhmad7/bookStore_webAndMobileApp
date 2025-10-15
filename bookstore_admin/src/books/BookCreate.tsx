import * as React from "react";
import {
  Create,
  TabbedForm,
  TextInput,
  required,
  useCreateContext,
  useDefaultTitle,
} from "react-admin";
import { BookEditDetails } from "./BookEditDetails";
import ImageUploadField from "./ImageUploadField";

const RichTextInput = React.lazy(() =>
  import("ra-input-rich-text").then((module) => ({
    default: module.RichTextInput,
  }))
);

const BookTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useCreateContext();

  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const BookCreate = () => (
  <Create title={<BookTitle />}>
    <TabbedForm defaultValues={{ stockQuantity: 0, isActive: true }}>
      <TabbedForm.Tab
        label="resources.books.tabs.image"
        sx={{ maxWidth: "40em" }}
      >
        <ImageUploadField source="coverImage" label="Cover Image" />
      </TabbedForm.Tab>
      <TabbedForm.Tab
        label="resources.books.tabs.details"
        path="details"
        sx={{ maxWidth: "40em" }}
      >
        <BookEditDetails />
      </TabbedForm.Tab>
      <TabbedForm.Tab
        label="resources.books.tabs.description"
        path="description"
      >
        <RichTextInput source="description" label="" />
      </TabbedForm.Tab>
    </TabbedForm>
  </Create>
);

export default BookCreate;

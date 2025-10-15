import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  maxLength,
} from "react-admin";

const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="name"
        validate={[required(), maxLength(100)]}
        fullWidth
      />
      <TextInput
        source="description"
        validate={[maxLength(500)]}
        multiline
        rows={3}
        fullWidth
      />
    </SimpleForm>
  </Create>
);

export default CategoryCreate;

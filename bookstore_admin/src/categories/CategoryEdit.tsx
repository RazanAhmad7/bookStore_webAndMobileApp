import * as React from "react";
import { Edit, SimpleForm, TextInput, required, maxLength } from "react-admin";

const CategoryEdit = () => (
  <Edit>
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
  </Edit>
);

export default CategoryEdit;

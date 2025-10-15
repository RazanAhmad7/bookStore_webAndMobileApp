import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  required,
  maxLength,
} from "react-admin";

const AuthorEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput
        source="firstName"
        validate={[required(), maxLength(50)]}
        fullWidth
      />
      <TextInput
        source="lastName"
        validate={[required(), maxLength(50)]}
        fullWidth
      />
      <TextInput
        source="biography"
        multiline
        rows={4}
        validate={[maxLength(1000)]}
        fullWidth
      />
      <TextInput source="nationality" validate={[maxLength(100)]} fullWidth />
      <DateInput source="dateOfBirth" />
    </SimpleForm>
  </Edit>
);

export default AuthorEdit;

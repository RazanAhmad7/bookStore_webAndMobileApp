import * as React from "react";
import {
  NumberInput,
  required,
  TextInput,
  DateInput,
  BooleanInput,
  useGetList,
  useInput,
} from "react-admin";
import {
  InputAdornment,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Chip,
} from "@mui/material";

export const BookEditDetails = () => (
  <Grid container columnSpacing={2}>
    <Grid size={{ xs: 12, sm: 8 }}>
      <TextInput source="title" validate={req} />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextInput source="isbn" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <CategoryCheckboxes />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthorCheckboxes />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <NumberInput
        source="price"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        validate={req}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <NumberInput source="stockQuantity" validate={req} />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <NumberInput source="numberOfPages" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextInput source="publisher" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextInput source="language" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <DateInput source="publishedDate" />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <BooleanInput source="isActive" />
    </Grid>
  </Grid>
);

const req = [required()];

// Checkbox component for categories
const CategoryCheckboxes = () => {
  const { data: categories } = useGetList("categories", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  const validateCategories = (value: number[]) => {
    if (!value || value.length === 0) {
      return "Please select at least one category";
    }
    return undefined;
  };

  const { field } = useInput({
    source: "categoryIds",
    validate: validateCategories,
  });
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    field.value || []
  );

  // Sync state when field value changes (for editing)
  React.useEffect(() => {
    setSelectedCategories(field.value || []);
  }, [field.value]);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const newSelection = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(newSelection);
    field.onChange(newSelection);
  };

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend">Categories</FormLabel>
      <FormGroup>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {categories?.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) =>
                    handleCategoryChange(category.id, e.target.checked)
                  }
                />
              }
              label={category.name}
            />
          ))}
        </Box>
        {selectedCategories.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Selected: {selectedCategories.length} categories
            </Typography>
          </Box>
        )}
      </FormGroup>
    </FormControl>
  );
};

// Checkbox component for authors
const AuthorCheckboxes = () => {
  const { data: authors } = useGetList("authors", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "firstName", order: "ASC" },
  });

  const validateAuthors = (value: number[]) => {
    if (!value || value.length === 0) {
      return "Please select at least one author";
    }
    return undefined;
  };

  const { field } = useInput({
    source: "authorIds",
    validate: validateAuthors,
  });
  const [selectedAuthors, setSelectedAuthors] = React.useState<number[]>(
    field.value || []
  );

  // Sync state when field value changes (for editing)
  React.useEffect(() => {
    setSelectedAuthors(field.value || []);
  }, [field.value]);

  const handleAuthorChange = (authorId: number, checked: boolean) => {
    const newSelection = checked
      ? [...selectedAuthors, authorId]
      : selectedAuthors.filter((id) => id !== authorId);

    setSelectedAuthors(newSelection);
    field.onChange(newSelection);
  };

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend">Authors</FormLabel>
      <FormGroup>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {authors?.map((author) => (
            <FormControlLabel
              key={author.id}
              control={
                <Checkbox
                  checked={selectedAuthors.includes(author.id)}
                  onChange={(e) =>
                    handleAuthorChange(author.id, e.target.checked)
                  }
                />
              }
              label={author.fullName}
            />
          ))}
        </Box>
        {selectedAuthors.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Selected: {selectedAuthors.length} authors
            </Typography>
          </Box>
        )}
      </FormGroup>
    </FormControl>
  );
};

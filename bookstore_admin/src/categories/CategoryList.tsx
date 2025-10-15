import * as React from "react";
import {
  CreateButton,
  EditButton,
  List,
  RecordContextProvider,
  useDefaultTitle,
  useListContext,
  TopToolbar,
  useGetList,
} from "react-admin";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { humanize } from "inflection";

import LinkToRelatedProducts from "./LinkToRelatedProducts";
import { Category } from "../types";

const CategoriesTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const CategoryList = () => (
  <List
    sort={{ field: "name", order: "ASC" }}
    perPage={20}
    pagination={false}
    component="div"
    actions={<CategoryListActions />}
    title={<CategoriesTitle />}
  >
    <CategoryGrid />
  </List>
);

const CategoryGrid = () => {
  const { data, error, isPending } = useListContext<Category>();
  if (isPending) {
    return null;
  }
  if (error) {
    return null;
  }
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {data.map((record) => (
        <RecordContextProvider key={record.id} value={record}>
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <CategoryCard category={record} />
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  // Fetch book count for this category
  const { data: books, isLoading } = useGetList("books", {
    filter: { categoryId: category.id },
    pagination: { page: 1, perPage: 1 }, // We only need the count
  });

  const bookCount = books?.length || 0;

  return (
    <Card>
      <CardMedia
        image={`https://marmelab.com/posters/${category.name}-1.jpeg`}
        sx={{ height: 140 }}
      />
      <CardContent sx={{ paddingBottom: "0.5em" }}>
        <Typography variant="h5" component="h2" align="center">
          {humanize(category.name)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Chip
            label={`${bookCount} ${bookCount === 1 ? "Book" : "Books"}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions
        sx={{
          ".MuiCardActions-spacing": {
            display: "flex",
            justifyContent: "space-around",
          },
        }}
      >
        <LinkToRelatedProducts />
        <EditButton />
      </CardActions>
    </Card>
  );
};

const CategoryListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

export default CategoryList;

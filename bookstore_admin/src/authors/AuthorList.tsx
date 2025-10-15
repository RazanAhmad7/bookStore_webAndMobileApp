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
  Avatar,
} from "@mui/material";
import { humanize } from "inflection";

import { Author } from "../types";

const AuthorsTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const AuthorList = () => (
  <List
    sort={{ field: "firstName", order: "ASC" }}
    perPage={20}
    pagination={false}
    component="div"
    actions={<AuthorListActions />}
    title={<AuthorsTitle />}
  >
    <AuthorGrid />
  </List>
);

const AuthorGrid = () => {
  const { data, error, isPending } = useListContext<Author>();
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
            <AuthorCard author={record} />
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
};

const AuthorCard = ({ author }: { author: Author }) => {
  // Fetch book count for this author
  const { data: books, isLoading } = useGetList("books", {
    filter: { authorId: author.id },
    pagination: { page: 1, perPage: 1 }, // We only need the count
  });

  const bookCount = books?.length || 0;

  // Generate avatar initials
  const initials = `${author.firstName.charAt(0)}${author.lastName.charAt(
    0
  )}`.toUpperCase();

  return (
    <Card>
      <CardContent sx={{ paddingBottom: "0.5em", textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {initials}
          </Avatar>
        </Box>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          {author.fullName}
        </Typography>
        {author.nationality && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {author.nationality}
          </Typography>
        )}
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
        <EditButton />
      </CardActions>
    </Card>
  );
};

const AuthorListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

export default AuthorList;

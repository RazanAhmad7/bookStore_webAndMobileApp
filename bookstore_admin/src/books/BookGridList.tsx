import * as React from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useCreatePath, NumberField, useListContext } from "react-admin";
import { Link } from "react-router-dom";

const BookGridList = () => {
  const { isPending } = useListContext();
  return isPending ? <LoadingGridList /> : <LoadedGridList />;
};

const useColsForWidth = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const xl = useMediaQuery(theme.breakpoints.up("xl"));
  // there are all dividers of 24, to have full rows on each page
  if (xl) return 8;
  if (lg) return 6;
  if (md) return 4;
  if (sm) return 3;
  return 2;
};

const times = (nbChildren: number, fn: (key: number) => any) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = () => {
  const { perPage } = useListContext();
  const cols = useColsForWidth();
  return (
    <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
      {times(perPage, (key) => (
        <ImageListItem key={key}>
          <Box
            sx={{
              bgcolor: "grey.300",
              height: "100%",
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

const LoadedGridList = () => {
  const { data } = useListContext();
  const cols = useColsForWidth();
  const createPath = useCreatePath();

  if (!data) return null;

  // Handle empty state
  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h4" color="text.secondary" gutterBottom>
          📚 No Books Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your bookstore is empty. Start by adding your first book!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click the "Create" button above to add a new book to your collection.
        </Typography>
      </Box>
    );
  }

  return (
    <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
      {data.map((record) => (
        <ImageListItem
          component={Link}
          key={record.id}
          to={createPath({
            resource: "books",
            id: record.id,
            type: "edit",
          })}
        >
          <img
            src={
              record.coverImagePath ||
              `https://marmelab.com/posters/${record.title}-1.jpeg`
            }
            alt={record.title}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            onError={(e) => {
              console.log(
                "Image failed to load:",
                record.coverImagePath,
                "for book:",
                record.title
              );
              // Fallback to a default image
              e.currentTarget.src = `https://marmelab.com/posters/${record.title}-1.jpeg`;
            }}
          />
          <ImageListItemBar
            title={record.title}
            subtitle={
              <span>
                by {record.author?.fullName || "Unknown Author"},{" "}
                <NumberField
                  source="price"
                  record={record}
                  color="inherit"
                  options={{
                    style: "currency",
                    currency: "USD",
                  }}
                  sx={{
                    display: "inline",
                    fontSize: "1em",
                  }}
                />
              </span>
            }
            sx={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)",
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default BookGridList;

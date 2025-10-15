import * as React from "react";
import { Box, Chip, useMediaQuery, Theme } from "@mui/material";
import {
  CreateButton,
  ExportButton,
  FilterButton,
  FilterForm,
  FilterContext,
  InputProps,
  ListBase,
  NumberInput,
  Pagination,
  ReferenceInput,
  SearchInput,
  SelectInput,
  SortButton,
  Title,
  TopToolbar,
  useTranslate,
  useDefaultTitle,
  useListContext,
  useListController,
} from "react-admin";
import { useLocation } from "react-router-dom";

import BookGridList from "./BookGridList";
import BookAside from "./BookAside";

const BookList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));
  const location = useLocation();

  // Parse URL parameters to get initial filters
  const urlParams = new URLSearchParams(location.search);
  const initialFilters = React.useMemo(() => {
    const filters: any = {};
    if (urlParams.get("categoryId")) {
      filters.categoryId = parseInt(urlParams.get("categoryId")!);
    }
    if (urlParams.get("authorId")) {
      filters.authorId = parseInt(urlParams.get("authorId")!);
    }
    if (urlParams.get("q")) {
      filters.q = urlParams.get("q");
    }
    if (urlParams.get("price_gte")) {
      filters.price_gte = parseFloat(urlParams.get("price_gte")!);
    }
    if (urlParams.get("price_lte")) {
      filters.price_lte = parseFloat(urlParams.get("price_lte")!);
    }
    if (urlParams.get("stockQuantity_lte")) {
      filters.stockQuantity_lte = parseInt(urlParams.get("stockQuantity_lte")!);
    }
    return filters;
  }, [location.search]);

  // Debug: Log the filter values
  React.useEffect(() => {
    console.log("BookList initialFilters:", initialFilters);
  }, [initialFilters]);

  return (
    <ListBase
      perPage={24}
      sort={{ field: "title", order: "ASC" }}
      filter={
        Object.keys(initialFilters).length > 0 ? initialFilters : undefined
      }
    >
      <BookTitle />
      <FilterContext.Provider value={bookFilters}>
        <ListActions isSmall={isSmall} />
        {isSmall && (
          <Box
            sx={{
              m: 1,
            }}
          >
            <FilterForm />
          </Box>
        )}
      </FilterContext.Provider>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <BookAside />
        <Box
          sx={{
            width: isSmall ? "auto" : "calc(100% - 16em)",
          }}
        >
          <BookGridList />
          <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
        </Box>
      </Box>
    </ListBase>
  );
};

const BookTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useListContext();

  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <Title defaultTitle={defaultTitle} />
    </>
  );
};

const QuickFilter = ({ label }: InputProps) => {
  const translate = useTranslate();
  return <Chip sx={{ mb: 1 }} label={translate(label as string)} />;
};

export const bookFilters = [
  <SearchInput source="q" alwaysOn />,
  <ReferenceInput
    source="categoryId"
    reference="categories"
    sort={{ field: "id", order: "ASC" }}
  >
    <SelectInput source="name" />
  </ReferenceInput>,
  <ReferenceInput
    source="authorId"
    reference="authors"
    sort={{ field: "id", order: "ASC" }}
  >
    <SelectInput source="fullName" />
  </ReferenceInput>,
  <NumberInput source="price_gte" />,
  <NumberInput source="price_lte" />,
  <QuickFilter
    label="resources.books.fields.stock_lte"
    source="stockQuantity_lte"
    defaultValue={10}
  />,
];

const ListActions = ({ isSmall }: any) => (
  <TopToolbar>
    {isSmall && <FilterButton />}
    <SortButton fields={["title", "price", "stockQuantity"]} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export default BookList;

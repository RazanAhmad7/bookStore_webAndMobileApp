import * as React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { FilterList, FilterListItem, useGetList } from "react-admin";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";

const BookAside = () => {
  // Fetch categories from database
  const { data: categories } = useGetList("categories", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  // Fetch authors from database
  const { data: authors } = useGetList("authors", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "firstName", order: "ASC" },
  });

  return (
    <Card sx={{ order: -1, mr: 2, mt: 1, mb: 1 }}>
      <CardHeader title="Filters" />
      <CardContent>
        <FilterList label="Categories" resource="books" icon={<CategoryIcon />}>
          {categories?.map((category) => (
            <FilterListItem
              key={category.id}
              value={{ categoryId: category.id }}
              label={category.name}
            />
          ))}
        </FilterList>
        <FilterList label="Authors" resource="books" icon={<PersonIcon />}>
          {authors?.map((author) => (
            <FilterListItem
              key={author.id}
              value={{ authorId: author.id }}
              label={
                author.fullName || `${author.firstName} ${author.lastName}`
              }
            />
          ))}
        </FilterList>
        <FilterList
          label="Price Range"
          resource="books"
          icon={<AttachMoneyIcon />}
        >
          <FilterListItem
            value={{ price_gte: 0, price_lte: 10 }}
            label="Under $10"
          />
          <FilterListItem
            value={{ price_gte: 10, price_lte: 25 }}
            label="$10 - $25"
          />
          <FilterListItem
            value={{ price_gte: 25, price_lte: 50 }}
            label="$25 - $50"
          />
          <FilterListItem value={{ price_gte: 50 }} label="Over $50" />
        </FilterList>
        <FilterList label="Stock" resource="books" icon={<InventoryIcon />}>
          <FilterListItem value={{ stockQuantity_gte: 1 }} label="In Stock" />
          <FilterListItem
            value={{ stockQuantity_lte: 0 }}
            label="Out of Stock"
          />
          <FilterListItem value={{ stockQuantity_lte: 5 }} label="Low Stock" />
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default BookAside;

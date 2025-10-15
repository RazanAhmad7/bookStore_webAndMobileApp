import * as React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useTranslate, useRecordContext } from "react-admin";
import { stringify } from "query-string";
import BookIcon from "@mui/icons-material/Book";

import { Category } from "../types";

const LinkToRelatedProducts = () => {
  const record = useRecordContext<Category>();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <Button
      size="small"
      color="primary"
      component={Link}
      to={{
        pathname: "/books",
        search: stringify({
          categoryId: record.id,
        }),
      }}
      sx={{ display: "inline-flex", alignItems: "center" }}
    >
      <BookIcon sx={{ paddingRight: "0.5em" }} />
      {translate("resources.categories.fields.products")}
    </Button>
  );
};

export default LinkToRelatedProducts;

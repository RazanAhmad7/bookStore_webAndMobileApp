import polyglotI18nProvider from "ra-i18n-polyglot";
import {
  Admin,
  CustomRoutes,
  Resource,
  localStorageStore,
  useStore,
  StoreContextProvider,
} from "react-admin";
import { Route } from "react-router";

import authProvider from "./authProvider";
import authors from "./authors";
import categories from "./categories";
import { Dashboard } from "./dashboard";
import dataProvider from "./dataProvider/customRestProvider";
import englishMessages from "./i18n/en";
import invoices from "./invoices";
import { Layout, Login } from "./layout";
import orders from "./orders";
import books from "./books";
import reviews from "./reviews";
import Segments from "./segments/Segments";
import visitors from "./visitors";
import { themes, ThemeName } from "./themes/themes";

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") {
      return import("./i18n/fr").then((messages) => messages.default);
    }

    // Always fallback on english
    return englishMessages;
  },
  "en",
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
  ]
);

const store = localStorageStore(undefined, "ECommerce");

const App = () => {
  const [themeName] = useStore<ThemeName>("themeName", "soft");
  const singleTheme = themes.find((theme) => theme.name === themeName)?.single;
  const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      title="Bookstore Admin"
      dataProvider={dataProvider}
      store={store}
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      layout={Layout}
      i18nProvider={i18nProvider}
      disableTelemetry
      theme={singleTheme}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      requireAuth
    >
      <CustomRoutes>
        <Route path="/segments" element={<Segments />} />
      </CustomRoutes>
      <Resource name="customers" {...visitors} />
      <Resource name="orders" {...orders} />
      <Resource name="invoices" {...invoices} />
      <Resource name="books" {...books} />
      <Resource name="categories" {...categories} />
      <Resource name="authors" {...authors} />
      <Resource name="reviews" {...reviews} />
    </Admin>
  );
};

const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <App />
  </StoreContextProvider>
);

export default AppWrapper;

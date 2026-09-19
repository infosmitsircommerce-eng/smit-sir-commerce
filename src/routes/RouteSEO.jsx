import { useLocation } from "react-router-dom";
import SEO from "../components/ui/SEO";
import { ROUTE_SEO, routeUsesOwnSeo } from "../config/routeSeo";

export default function RouteSEO() {
  const { pathname } = useLocation();
  if (routeUsesOwnSeo(pathname)) return null;

  const meta = ROUTE_SEO[pathname] || {
    title: "Page Not Found",
    description: "The requested page could not be found.",
    noindex: true,
  };

  return <SEO {...meta} path={pathname} />;
}

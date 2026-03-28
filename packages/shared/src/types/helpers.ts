import type { Tables } from './database';

export type Peak = Tables<'peaks'>;
export type Route = Tables<'routes'>;
export type PeakWithRoutes = Peak & { routes: Route[] };
export type PeakWithStandardRoute = Peak & { standard_route?: Route };
